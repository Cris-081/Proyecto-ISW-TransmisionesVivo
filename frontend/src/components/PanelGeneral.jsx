import { useEffect, useState } from "react";
import { getTransmisionesPorMes } from "../services/transmision.service.js";

export default function PanelGeneral() {
  const [total, setTotal] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const hoy = new Date();
    getTransmisionesPorMes(hoy.getFullYear(), hoy.getMonth() + 1)
      .then((lista) => setTotal(lista.length))
      .catch((e) => setError(e.message));
  }, []);

  return (
    <section className="panel-general">
      <header className="pg-encabezado">
        <h1>Panel general</h1>
        <span className="pg-envivo">2 en vivo</span>
      </header>
      <h2>Gestión de cobertura de transmisión en vivo</h2>

      {error && <p>{error}</p>}

      <div className="pg-tarjetas">
        <article><h3>Transmisiones este mes</h3><p>{total ?? "…"}</p></article>
        <article><h3>Trabajadores disponibles hoy</h3><p>7/10</p></article>
        <article><h3>Ingresos confirmados</h3><p>$8.400.000</p></article>
        <article><h3>Pagos pendientes</h3><p>$2.680.000</p></article>
      </div>
    </section>
  );
}