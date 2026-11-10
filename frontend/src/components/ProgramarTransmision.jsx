import { useEffect, useState } from "react";
import { getDisponibilidad, crearTransmision } from "../services/transmision.service.js";
import Calendario from "./Calendario.jsx";

const formatearFecha = (iso) => {
  const [a, m, d] = iso.split("-").map(Number);
  return new Date(a, m - 1, d).toLocaleDateString("es-CL", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
};

/* REQUISITO 1: elegir el día en el calendario y reservar un horario libre */
export default function ProgramarTransmision({ fechaInicial }) {
  const [fecha, setFecha] = useState(fechaInicial); // día elegido (o null)
  const [slots, setSlots] = useState([]);
  const [seleccion, setSeleccion] = useState(null);
  const [tema, setTema] = useState("");
  const [mensaje, setMensaje] = useState(null); // { tipo: "ok" | "error", texto }
  const [refreshKey, setRefreshKey] = useState(0);

  const cargar = async () => {
    if (!fecha) return;
    try {
      setSlots(await getDisponibilidad(fecha));
    } catch (e) {
      setSlots([]);
      setMensaje({ tipo: "error", texto: e.message });
    }
  };

  useEffect(() => {
    setSeleccion(null);
    setSlots([]);
    cargar();
  }, [fecha]);

  // Bloquea horas que ya pasaron si el día elegido es hoy
  const esPasado = (slot) => new Date(`${fecha}T${slot.horaInicio}:00`) < new Date();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!seleccion) {
      return setMensaje({ tipo: "error", texto: "Selecciona un horario disponible." });
    }
    try {
      await crearTransmision({
        tema,
        fecha,
        horaInicio: seleccion.horaInicio,
        horaFin: seleccion.horaFin,
      });
      setMensaje({ tipo: "ok", texto: "Transmisión programada con éxito." });
      setTema("");
      setSeleccion(null);
      setRefreshKey((k) => k + 1); // el calendario muestra la nueva transmisión
      await cargar();
    } catch (err) {
      setMensaje({ tipo: "error", texto: err.message });
      cargar(); // por si otra persona tomó el horario
    }
  };

  return (
    <>
      <header className="vista-encabezado">
        <h1>Programar transmisión</h1>
      </header>

      <Calendario
        seleccionado={fecha}
        refreshKey={refreshKey}
        onElegirDia={(f) => {
          setFecha(f);
          setMensaje(null);
        }}
      />

      {fecha ? (
        <section className="horarios">
          <h2 className="subtitulo">
            Horarios del <span className="cap">{formatearFecha(fecha)}</span>
          </h2>

          <div className="slot-legend">
            <span className="slot-dot libre" /> Libre
            <span className="slot-dot ocupado" /> Reservado
            <span className="slot-dot elegido" /> Seleccionado
          </div>

          <div className="slot-grid">
            {slots.map((s) => {
              const bloqueado = !s.disponible || esPasado(s);
              const elegido = seleccion?.horaInicio === s.horaInicio;
              return (
                <button
                  key={s.horaInicio}
                  type="button"
                  disabled={bloqueado}
                  className={`slot ${!s.disponible ? "ocupado" : ""} ${elegido ? "elegido" : ""}`}
                  onClick={() => setSeleccion(s)}
                  title={s.tema || ""}
                >
                  <strong>{s.horaInicio} - {s.horaFin}</strong>
                  <small>{!s.disponible ? s.tema : esPasado(s) ? "Ya pasó" : "Disponible"}</small>
                </button>
              );
            })}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="tema-tx">Tema de la transmisión</label>
              <input
                id="tema-tx"
                type="text"
                value={tema}
                required
                maxLength={150}
                onChange={(e) => setTema(e.target.value)}
                placeholder="Ej. Misa dominical"
              />
            </div>
            <button className="btn-primary" type="submit">
              {seleccion ? `Reservar ${seleccion.horaInicio} - ${seleccion.horaFin}` : "Reservar horario"}
            </button>
          </form>
        </section>
      ) : (
        <p className="ayuda">Selecciona un día del calendario para ver los horarios disponibles.</p>
      )}

      {mensaje && (
        <p role="status" className={mensaje.tipo === "ok" ? "msg-ok" : "msg-error"}>
          {mensaje.texto}
        </p>
      )}
    </>
  );
}