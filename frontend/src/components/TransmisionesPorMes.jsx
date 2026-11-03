import { useEffect, useState } from "react";
import { getTransmisionesPorMes } from "../services/transmision.service.js";
import { SelectorMes } from "./SelectoresFecha.jsx";

const mesActual = () => new Date().toLocaleDateString("en-CA").slice(0, 7); // "2026-10"

const formatearFecha = (iso) => {
  const [a, m, d] = iso.split("-").map(Number);
  return new Date(a, m - 1, d).toLocaleDateString("es-CL", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
};

export default function TransmisionesPorMes({ refreshKey }) {
  const [mes, setMes] = useState(mesActual());
  const [lista, setLista] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!mes) return;
    const [anio, m] = mes.split("-");
    setError(null);
    getTransmisionesPorMes(anio, m)
      .then(setLista)
      .catch((e) => setError(e.message));
  }, [mes, refreshKey]);

  return (
    <section className="panel">
      <h2>Transmisiones programadas</h2>
      <p className="muted">Selecciona un mes para ver lo que ya está planificado.</p>

      <div className="field">
        <span className="label-text">Mes</span>
        <SelectorMes value={mes} onChange={setMes} />
      </div>

      {error && <p className="msg-error">{error}</p>}

      {lista.length ? (
        <div className="table-wrap">
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
        !error && <p className="muted">No hay transmisiones programadas en este mes.</p>
      )}
    </section>
  );
}