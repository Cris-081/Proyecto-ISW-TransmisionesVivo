import { useEffect, useState } from "react";
import { getTarifas } from "../services/transmision.service.js";

const formatoPrecio = (n) =>
  new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(n);

export default function ClientesPrecios() {
  const [tipo, setTipo] = useState("empresa");
  const [lista, setLista] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    setError("");
    getTarifas(tipo)
      .then(setLista)
      .catch((e) => {
        setLista([]);
        setError(e.message);
      });
  }, [tipo]);

  return (
    <section className="panel-general">
      <header className="pg-encabezado">
        <h1>Clientes y precios</h1>
      </header>
      <h2>Tarifas diferenciadas</h2>

      <div className="toggle-tipo" role="group" aria-label="Tipo de cliente">
        <button
          type="button"
          className={tipo === "empresa" ? "activo" : ""}
          onClick={() => setTipo("empresa")}
        >
          Empresa
        </button>
        <button
          type="button"
          className={tipo === "normal" ? "activo" : ""}
          onClick={() => setTipo("normal")}
        >
          Cliente normal
        </button>
      </div>

      {error && <p className="msg-error">{error}</p>}

      {lista.length ? (
        <div className="tabla-wrap">
          <table>
            <thead>
              <tr>
                <th>Servicio</th>
                <th>{tipo === "empresa" ? "Precio empresa" : "Precio normal"}</th>
                <th>Condición</th>
              </tr>
            </thead>
            <tbody>
              {lista.map((t) => (
                <tr key={t.id}>
                  <td>{t.servicio}</td>
                  <td>{formatoPrecio(t.precio)}</td>
                  <td>{t.condicion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !error && <p>No hay tarifas cargadas para este tipo de cliente.</p>
      )}
    </section>
  );
}