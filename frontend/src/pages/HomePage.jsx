import { useState } from "react";
import { useAuth } from "../hooks/useAuth.js";
import { labelFuncion, labelRol } from "../helpers/labels.js";
import { updateMyProfile } from "../services/user.service.js";
import { getErrorMessage } from "../helpers/errors.js";
import "../styles/Admin.css";

export default function HomePage() {
  const { user, updateUser } = useAuth();
  const funciones = user.funciones || [];

  // el usuario solo puede cambiar su correo y su telefono
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({ email: "", numeroTelefonico: "" });
  const [error, setError] = useState("");
  const [aviso, setAviso] = useState("");
  const [guardando, setGuardando] = useState(false);

  const empezarEdicion = () => {
    setForm({ email: user.email, numeroTelefonico: user.numeroTelefonico || "" });
    setError("");
    setAviso("");
    setEditando(true);
  };

  const guardar = async (e) => {
    e.preventDefault();
    setGuardando(true);
    setError("");
    try {
      const res = await updateMyProfile(form);
      updateUser(res.data);
      setEditando(false);
      setAviso("Tus datos se actualizaron. Si cambiaste el correo, usalo la proxima vez que inicies sesion.");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setGuardando(false);
    }
  };

  return (
    <main className="content">
      <div className="welcome-block">
        <p className="section-label">Panel de transmision</p>
        <h1 className="page-title">Hola, {user.nombre}</h1>
        <p className="welcome-copy">Aqui puedes revisar tus funciones y datos de cuenta.</p>
      </div>

      <section className="panel">
        <div className="panel-heading">
          <div>
            <p className="section-label">Asignaciones</p>
            <h2>Tus funciones</h2>
          </div>
        </div>
        {funciones.length ? (
          <ul className="chips">
            {funciones.map((f) => (
              <li key={f} className="chip">
                {labelFuncion(f)}
              </li>
            ))}
          </ul>
        ) : (
          <p className="muted">Todavia no tienes funciones asignadas. Habla con el coordinador.</p>
        )}
      </section>

      <section className="panel">
        <div className="panel-heading">
          <div>
            <p className="section-label">Cuenta</p>
            <h2>Tus datos</h2>
          </div>
          {!editando && (
            <button className="btn-small" type="button" onClick={empezarEdicion}>
              Editar correo y telefono
            </button>
          )}
        </div>
        {aviso && <p className="alert-info" role="status">{aviso}</p>}
        {editando ? (
          <form className="login-form admin-form" onSubmit={guardar}>
            {error && <p className="alert-error" role="alert">{error}</p>}
            <div className="form-grid">
              <div className="field">
                <label htmlFor="p-email">Correo</label>
                <input id="p-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              </div>
              <div className="field">
                <label htmlFor="p-phone">Telefono</label>
                <input id="p-phone" value={form.numeroTelefonico} onChange={(e) => setForm({ ...form, numeroTelefonico: e.target.value })} />
              </div>
            </div>
            <p className="muted">El nombre, el RUN, el rol y el estado solo los puede cambiar un administrador.</p>
            <div className="row-actions">
              <button className="btn-small primary" type="submit" disabled={guardando}>{guardando ? "Guardando..." : "Guardar"}</button>
              <button className="btn-small" type="button" onClick={() => setEditando(false)}>Cancelar</button>
            </div>
          </form>
        ) : (
          <dl className="data-list">
            <div><dt>Rol</dt><dd>{labelRol(user.role)}</dd></div>
            <div><dt>Estado</dt><dd><span className="status-value">{user.estado}</span></dd></div>
            <div><dt>Correo</dt><dd>{user.email}</dd></div>
            <div><dt>RUN</dt><dd>{user.run}</dd></div>
            <div><dt>Telefono</dt><dd>{user.numeroTelefonico || "Sin registrar"}</dd></div>
          </dl>
        )}
      </section>

    </main>
  );
}
