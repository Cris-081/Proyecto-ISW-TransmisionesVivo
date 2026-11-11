import { useEffect, useState } from "react";
import { getTransmisionesPorMes } from "../services/transmision.service.js";
import "./PanelGeneral.css";

export default function PanelGeneral() {
  const [lista, setLista] = useState(null); // transmisiones del mes
  const [ahora, setAhora] = useState(new Date());
  const [error, setError] = useState("");

  useEffect(() => {
    const hoy = new Date();
    getTransmisionesPorMes(hoy.getFullYear(), hoy.getMonth() + 1)
      .then(setLista)
      .catch((e) => setError(e.message));
  }, []);

  // Actualiza la hora cada 30 segundos para que "en vivo" se mantenga al día
  useEffect(() => {
    const id = setInterval(() => setAhora(new Date()), 30000);
    return () => clearInterval(id);
  }, []);

  const fechaHoy = ahora.toLocaleDateString("en-CA"); // "2026-11-10"
  const horaAhora = ahora.toTimeString().slice(0, 5); // "14:35"

  // En vivo = hoy, ya empezó y todavía no termina
  const enVivo = (lista || []).filter(
    (t) => t.fecha === fechaHoy && t.horaInicio <= horaAhora && horaAhora < t.horaFin
  ).length;

  // Las 3 últimas tarjetas son valores fijos por ahora
  const tarjetas = [
    { etiqueta: "Transmisiones este mes", valor: lista ? lista.length : "…" },
    { etiqueta: "Trabajadores disponibles hoy", valor: "7/10" },
    { etiqueta: "Ingresos confirmados", valor: "$8.400.000" },
    { etiqueta: "Pagos pendientes", valor: "$2.680.000" },
  ];

  return (
    <section className="panelgen">
      <header className="panelgen-encabezado">
        <h1 className="panelgen-titulo">Panel general</h1>
        <span className="panelgen-envivo">{enVivo} en vivo</span>
      </header>

      <p className="panelgen-tema">Tema del trabajo</p>
      <h2 className="panelgen-subtitulo">Gestión de cobertura de transmisión en vivo</h2>

      {error && <p className="panelgen-error">{error}</p>}

      <div className="panelgen-tarjetas">
        {tarjetas.map((t) => (
          <article key={t.etiqueta} className="panelgen-tarjeta">
            <span className="panelgen-tarjeta-etiqueta">{t.etiqueta}</span>
            <span className="panelgen-tarjeta-valor">{t.valor}</span>
          </article>
        ))}
      </div>
    </section>
  );
}