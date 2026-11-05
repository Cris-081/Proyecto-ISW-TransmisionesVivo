import { useEffect, useState } from "react";
import { getDisponibilidad, crearTransmision } from "../services/transmision.service.js";
import { SelectorFecha } from "./SelectoresFecha.jsx";

const hoy = () => new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD en hora local

export default function ProgramarTransmision({ onCreated }) {
  const [fecha, setFecha] = useState(hoy());
  const [slots, setSlots] = useState([]);
  const [seleccion, setSeleccion] = useState(null);
  const [tema, setTema] = useState("");
  const [mensaje, setMensaje] = useState(null); // { tipo: "ok" | "error", texto }

  const cargar = async () => {
    try {
      setSlots(await getDisponibilidad(fecha));
    } catch (e) {
      setMensaje({ tipo: "error", texto: e.message });
    }
  };

  useEffect(() => {
    if (!fecha) return;
    setSeleccion(null);
    cargar();
  }, [fecha]);

  // Bloquea horas que ya pasaron si la fecha es hoy
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
      await cargar();
      onCreated?.();
    } catch (err) {
      setMensaje({ tipo: "error", texto: err.message });
      cargar(); // por si otra persona tomó el horario
    }
  };

  return (
    <section className="panel">
      <h2>Programar transmisión</h2>
      <p className="muted">Elige un día y selecciona un bloque libre.</p>

      <div className="field">
        <span className="label-text">Fecha</span>
        <SelectorFecha
          value={fecha}
          min={hoy()}
          onChange={(f) => {
            setFecha(f);
            setMensaje(null);
          }}
        />
      </div>

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

      {mensaje && (
        <p role="status" className={mensaje.tipo === "ok" ? "msg-ok" : "msg-error"}>
          {mensaje.texto}
        </p>
      )}
    </section>
  );
}