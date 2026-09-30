import { useAuth } from "../hooks/useAuth.js";
import { labelFuncion, labelRol } from "../helpers/labels.js";
import AdminPanel from "../components/AdminPanel";

export default function HomePage() {
  const { user, logout } = useAuth();
  const funciones = user.funciones || [];

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="wordmark small">EnVivo</div>
        <div className="topbar-user">
          <span className="user-greeting">{user.nombre}</span>
          <button className="btn-ghost" onClick={logout}>
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className="content">
        <div className="welcome-block">
          <p className="section-label">Panel de transmisión</p>
          <h1 className="page-title">Hola, {user.nombre}</h1>
          <p className="welcome-copy">Aquí puedes revisar tus funciones y datos de cuenta.</p>
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
            <p className="muted">Todavía no tienes funciones asignadas. Habla con el coordinador.</p>
          )}
        </section>

        <section className="panel">
          <div className="panel-heading">
            <div>
              <p className="section-label">Cuenta</p>
              <h2>Tus datos</h2>
            </div>
          </div>
          <dl className="data-list">
            <div><dt>Rol</dt><dd>{labelRol(user.role)}</dd></div>
            <div><dt>Estado</dt><dd><span className="status-value">{user.estado}</span></dd></div>
            <div><dt>Correo</dt><dd>{user.email}</dd></div>
            <div><dt>RUN</dt><dd>{user.run}</dd></div>
            <div><dt>Teléfono</dt><dd>{user.numeroTelefonico || "Sin registrar"}</dd></div>
          </dl>
        </section>

        {user.role === "admin" && <AdminPanel />}
      </main>
    </div>
  );
}
