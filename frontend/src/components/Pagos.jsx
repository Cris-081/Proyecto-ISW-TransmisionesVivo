import { useEffect, useState } from "react";
import { getPagos } from "../services/transmision.service.js";

const FILTROS = [
  { id: "todos", etiqueta: "Todos" },
  { id: "adelantos", etiqueta: "Adelantos pendientes" },
  { id: "saldos", etiqueta: "Saldos pendientes" },
  { id: "pagado", etiqueta: "Pagado" },
];

const peso = (n) =>
  new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(n);

export default function Pagos() {
  const [filtro, setFiltro] = useState("todos");
  const [lista, setLista] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    setError("");
    getPagos(filtro)
      .then(setLista)
      .catch((e) => {
        setLista([]);
        setError(e.message);
      });
  }, [filtro]);

  return (
    <section className="panel-general">
      <header className="pg-encabezado">
        <h1>Pagos</h1>
      </header>
      <h2>Cobros y adelantos</h2>

      <div className="filtros-pago" role="group" aria-label="Filtrar pagos">
        {FILTROS.map((f) => (
          <button
            key={f.id}
            type="button"
            className={filtro === f.id ? "activo" : ""}
            onClick={() => setFiltro(f.id)}
          >
            {f.etiqueta}
          </button>
        ))}
      </div>

      {error && <p className="msg-error">{error}</p>}

      {lista.length ? (
        <div className="tabla-wrap">
          <table>
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Transmisión</th>
                <th>Total</th>
                <th>Adelanto 50%</th>
                <th>Progreso</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {lista.map((p) => (
                <tr key={p.id}>
                  <td>{p.cliente}</td>
                  <td>{p.transmision}</td>
                  <td>{peso(p.total)}</td>
                  <td>{peso(p.montoPagado >= p.adelanto ? p.adelanto : p.montoPagado)}</td>
                  <td>{p.progreso}%</td>
                  <td>{p.estado}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !error && <p>No hay pagos en esta categoría.</p>
      )}
    </section>
  );
}