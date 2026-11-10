import { useEffect, useState } from "react";
import { getTransmisionesPorMes } from "../services/transmision.service.js";

const CAPACIDAD_MAXIMA = 3; // fijo por ahora

export default function CoberturaEnVivo() {
  const [hoyLista, setHoyLista] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const hoy = new Date();
    const iso = hoy.toLocaleDateString("en-CA"); // YYYY-MM-DD local
    getTransmisionesPorMes(hoy.getFullYear(), hoy.getMonth() + 1)
      .then((lista) => setHoyLista(lista.filter((t) => t.fecha.slice(0, 10) === iso)))
      .catch((e) => setError(e.message));
  }, []);

  return (
    <section className="panel-general">
      <header className="pg-encabezado">
        <h1>Cobertura en vivo</h1>
        <span className="pg-envivo">{hoyLista.length} en vivo</span>
      </header>
      <h2>Cobertura de transmisión simultánea</h2>

      {error && <p>{error}</p>}

      <div className="pg-tarjetas pg-tres">
        <article><h3>Transmisiones simultáneas hoy</h3><p>{hoyLista.length}</p></article>
        <article><h3>Capacidad máxima de cobertura</h3><p>{CAPACIDAD_MAXIMA}</p></article>
        <article><h3>Transmisiones en riesgo</h3><p>0</p></article>
      </div>

      <h2>Cobertura de hoy</h2>
      {hoyLista.length ? (
        <div className="tabla-wrap">
          <table>
            <thead>
              <tr>
                <th>Transmisión</th><th>Horario</th><th>Equipo humano</th>
                <th>Equipo técnico</th><th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {hoyLista.map((t) => (
                <tr key={t.id}>
                  <td>{t.tema}</td>
                  <td>{t.horaInicio} - {t.horaFin}</td>
                  <td>Sin asignar</td>
                  <td>Sin asignar</td>
                  <td>Pendiente</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !error && <p>No hay transmisiones programadas para hoy.</p>
      )}
    </section>
  );
}