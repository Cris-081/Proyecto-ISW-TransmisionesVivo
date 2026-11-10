import { useEffect, useState } from "react";
import { getTransmisionesPorMes } from "../services/transmision.service.js";
import { MESES, SelectorMes } from "./SelectoresFecha.jsx";

const DIAS_SEMANA = ["LUN", "MAR", "MIÉ", "JUE", "VIE", "SAB", "DOM"];
const pad = (n) => String(n).padStart(2, "0");
const hoyISO = () => new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD local

// new Date(a, m-1, d) evita el desfase de zona horaria de new Date("YYYY-MM-DD")
const formatearFecha = (iso) => {
  const [a, m, d] = iso.split("-").map(Number);
  return new Date(a, m - 1, d).toLocaleDateString("es-CL", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
};

/*
  Calendario del mes. Se usa en dos pantallas:
  - Calendario (Req. 2): mostrarListado = true
  - Programar (Req. 1):  seleccionado + onElegirDia para escoger el día
*/
export default function Calendario({ seleccionado, onElegirDia, refreshKey, mostrarListado }) {
  const hoy = hoyISO();
  const [mes, setMes] = useState((seleccionado || hoy).slice(0, 7)); // "2026-11"
  const [lista, setLista] = useState([]);
  const [error, setError] = useState(null);

  const [anio, m] = mes.split("-").map(Number);

  useEffect(() => {
    setError(null);
    getTransmisionesPorMes(anio, m)
      .then(setLista)
      .catch((e) => {
        setLista([]);
        setError(e.message);
      });
  }, [anio, m, refreshKey]);

  const cambiarMes = (delta) => {
    const d = new Date(anio, m - 1 + delta, 1);
    setMes(`${d.getFullYear()}-${pad(d.getMonth() + 1)}`);
  };

  // Agrupa las transmisiones por número de día
  const porDia = {};
  lista.forEach((t) => {
    const dia = Number(t.fecha.slice(8, 10));
    if (!porDia[dia]) porDia[dia] = [];
    porDia[dia].push(t);
  });

  // La semana comienza el lunes
  const offset = (new Date(anio, m - 1, 1).getDay() + 6) % 7;
  const diasMes = new Date(anio, m, 0).getDate();
  const celdas = [
    ...Array(offset).fill(null),
    ...Array.from({ length: diasMes }, (_, i) => i + 1),
  ];

  const nombreMes = MESES[m - 1];

  return (
    <>
      {mostrarListado && (
        <header className="vista-encabezado">
          <h1>Transmisiones {nombreMes}</h1>
        </header>
      )}

      <div className="mes-barra">
        <h2 className="mes-titulo">{nombreMes.toUpperCase()} {anio}</h2>
        <div className="mes-controles">
          <button type="button" className="flecha" aria-label="Mes anterior" onClick={() => cambiarMes(-1)}>‹</button>
          <button type="button" className="flecha" aria-label="Mes siguiente" onClick={() => cambiarMes(1)}>›</button>
          <SelectorMes value={mes} onChange={setMes} />
        </div>
      </div>

      {error && <p className="msg-error">{error}</p>}

      <div className="calendario" role="grid" aria-label={`Calendario de ${nombreMes} ${anio}`}>
        {DIAS_SEMANA.map((d) => (
          <div key={d} className="dia-semana" role="columnheader">{d}</div>
        ))}

        {celdas.map((dia, i) => {
          if (dia === null) return <div key={`v${i}`} className="dia vacio" />;

          const iso = `${anio}-${pad(m)}-${pad(dia)}`;
          const eventos = porDia[dia] || [];
          const pasado = iso < hoy;
          const clases = [
            "dia",
            eventos.length ? "con-evento" : "",
            iso === hoy ? "hoy" : "",
            iso === seleccionado ? "seleccionado" : "",
          ].join(" ");

          return (
            <button
              key={iso}
              type="button"
              className={clases}
              disabled={pasado}
              onClick={() => onElegirDia && onElegirDia(iso)}
              title={
                eventos.length
                  ? eventos.map((t) => `${t.horaInicio} ${t.tema}`).join("\n")
                  : pasado ? "" : "Elegir este día"
              }
            >
              <span className="dia-num">{dia}</span>
              {eventos.slice(0, 2).map((t) => (
                <span key={t.id} className="dia-tema">{t.tema}</span>
              ))}
              {eventos.length > 2 && (
                <span className="dia-tema mas">+{eventos.length - 2} más</span>
              )}
            </button>
          );
        })}
      </div>

      {mostrarListado && (
        <>
          <p className="ayuda">Haz clic en un día para programar una transmisión.</p>

          <h2 className="subtitulo">Listado del mes</h2>

          {lista.length ? (
            <div className="tabla-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Hora</th>
                    <th>Tema</th>
                  </tr>
                </thead>
                <tbody>
                  {lista.map((t) => (
                    <tr key={t.id}>
                      <td className="cap">{formatearFecha(t.fecha)}</td>
                      <td>{t.horaInicio} - {t.horaFin}</td>
                      <td>{t.tema}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            !error && <p className="vacio-msg">No hay transmisiones programadas en este mes.</p>
          )}
        </>
      )}
    </>
  );
}