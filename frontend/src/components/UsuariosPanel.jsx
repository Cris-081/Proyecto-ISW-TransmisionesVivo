import { useState } from "react";
import {
  createUser,
  updateUser,
  updateUserRole,
  updateUserFunciones,
  assignUserToTeam,
} from "../services/admin.service.js";
import { useAdminData } from "../hooks/useAdminData.js";
import { FUNCIONES } from "../helpers/labels.js";
import "../styles/Admin.css";

const EMPTY_USER = {
  nombre: "",
  email: "",
  run: "",
  password: "",
  numeroTelefonico: "",
  role: "operador",
  funciones: [],
};

export default function UsuariosPanel() {
  const { users, teams, error, run } = useAdminData();
  const [newUser, setNewUser] = useState(EMPTY_USER);
  const [editingUser, setEditingUser] = useState(null);

  const handleRoleChange = (userId, newRole) => run(() => updateUserRole(userId, newRole));

  const handleTeamAssign = (userId, teamId) =>
    run(() => assignUserToTeam(userId, teamId ? Number(teamId) : null));

  const toggleFuncion = (user, funcion) => {
    const actuales = user.funciones || [];
    const nuevas = actuales.includes(funcion)
      ? actuales.filter((f) => f !== funcion)
      : [...actuales, funcion];
    run(() => updateUserFunciones(user.id, nuevas));
  };

  const setUserField = (field, value) => setNewUser((prev) => ({ ...prev, [field]: value }));

  const toggleNewUserFuncion = (funcion) =>
    setNewUser((prev) => ({
      ...prev,
      funciones: prev.funciones.includes(funcion)
        ? prev.funciones.filter((f) => f !== funcion)
        : [...prev.funciones, funcion],
    }));

  // el admin puede modificar todos los datos de un usuario (la clave solo se cambia si escribe una nueva)
  const startEditUser = (user) =>
    setEditingUser({
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      run: user.run,
      numeroTelefonico: user.numeroTelefonico || "",
      estado: user.estado,
      password: "",
    });

  const setEditField = (field, value) => setEditingUser((prev) => ({ ...prev, [field]: value }));

  const handleSaveUser = async (e) => {
    e.preventDefault();
    const { id, ...datos } = editingUser;
    const ok = await run(() => updateUser(id, datos));
    if (ok) setEditingUser(null);
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    const ok = await run(() => createUser(newUser));
    if (ok) setNewUser(EMPTY_USER);
  };

  return (
    <div className="admin-panel">
      <h1>Usuarios</h1>

      {error && (
        <p className="alert-error" role="alert">
          {error}
        </p>
      )}

      {editingUser && (
        <form className="login-form admin-form" onSubmit={handleSaveUser}>
          <h2>Editar usuario</h2>
          <div className="form-grid">
            <div className="field">
              <label htmlFor="e-nombre">Nombre</label>
              <input id="e-nombre" value={editingUser.nombre} onChange={(e) => setEditField("nombre", e.target.value)} required />
            </div>
            <div className="field">
              <label htmlFor="e-email">Correo</label>
              <input id="e-email" type="email" value={editingUser.email} onChange={(e) => setEditField("email", e.target.value)} required />
            </div>
            <div className="field">
              <label htmlFor="e-run">RUN</label>
              <input id="e-run" value={editingUser.run} onChange={(e) => setEditField("run", e.target.value)} required />
            </div>
            <div className="field">
              <label htmlFor="e-phone">Telefono</label>
              <input id="e-phone" value={editingUser.numeroTelefonico} onChange={(e) => setEditField("numeroTelefonico", e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="e-estado">Estado</label>
              <select id="e-estado" value={editingUser.estado} onChange={(e) => setEditField("estado", e.target.value)}>
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
                <option value="Bloqueado">Bloqueado</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="e-pass">Nueva contrasena (opcional)</label>
              <input id="e-pass" type="password" minLength={6} placeholder="Dejala vacia para no cambiarla" value={editingUser.password} onChange={(e) => setEditField("password", e.target.value)} />
            </div>
          </div>
          <p className="muted">El rol, las funciones y el equipo se cambian directo en la tabla.</p>
          <div className="row-actions">
            <button className="btn-small primary" type="submit">Guardar cambios</button>
            <button className="btn-small" type="button" onClick={() => setEditingUser(null)}>Cancelar</button>
          </div>
        </form>
      )}

      <div className="admin-users-table-wrap">
        <table className="admin-users-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Telefono</th>
              <th>Rol de acceso</th>
              <th>Funciones</th>
              <th>Equipo</th>
              <th>Datos</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.nombre}</td>
                <td>{user.email}</td>
                <td>{user.numeroTelefonico || "-"}</td>
                <td>
                  <select
                    aria-label={`Rol de ${user.nombre}`}
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  >
                    <option value="admin">Admin</option>
                    <option value="coordinador">Coordinador</option>
                    <option value="operador">Operador</option>
                  </select>
                </td>
                <td>
                  <div className="funciones-grid" role="group" aria-label={`Funciones de ${user.nombre}`}>
                    {Object.entries(FUNCIONES).map(([key, label]) => (
                      <label key={key} className="check">
                        <input
                          type="checkbox"
                          checked={(user.funciones || []).includes(key)}
                          onChange={() => toggleFuncion(user, key)}
                        />
                        {label}
                      </label>
                    ))}
                  </div>
                </td>
                <td>
                  <select
                    aria-label={`Equipo de ${user.nombre}`}
                    value={user.team ? user.team.id : ""}
                    onChange={(e) => handleTeamAssign(user.id, e.target.value)}
                  >
                    <option value="">Sin equipo</option>
                    {teams.map((team) => (
                      <option key={team.id} value={team.id}>
                        {team.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <button className="btn-small" type="button" onClick={() => startEditUser(user)}>
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <details className="admin-details">
        <summary>Registrar nuevo usuario</summary>
        <form className="login-form admin-form" onSubmit={handleCreateUser}>
          <div className="form-grid">
            <div className="field">
              <label htmlFor="u-nombre">Nombre</label>
              <input id="u-nombre" value={newUser.nombre} onChange={(e) => setUserField("nombre", e.target.value)} required />
            </div>
            <div className="field">
              <label htmlFor="u-email">Correo</label>
              <input id="u-email" type="email" value={newUser.email} onChange={(e) => setUserField("email", e.target.value)} required />
            </div>
            <div className="field">
              <label htmlFor="u-run">RUN</label>
              <input id="u-run" placeholder="12345678-9" value={newUser.run} onChange={(e) => setUserField("run", e.target.value)} required />
            </div>
            <div className="field">
              <label htmlFor="u-phone">Telefono (opcional)</label>
              <input id="u-phone" value={newUser.numeroTelefonico} onChange={(e) => setUserField("numeroTelefonico", e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="u-pass">Contrasena inicial</label>
              <input id="u-pass" type="password" minLength={6} value={newUser.password} onChange={(e) => setUserField("password", e.target.value)} required />
            </div>
            <div className="field">
              <label htmlFor="u-role">Rol de acceso</label>
              <select id="u-role" value={newUser.role} onChange={(e) => setUserField("role", e.target.value)}>
                <option value="operador">Operador</option>
                <option value="coordinador">Coordinador</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          <div className="field">
            <label>Funciones</label>
            <div className="funciones-grid">
              {Object.entries(FUNCIONES).map(([key, label]) => (
                <label key={key} className="check">
                  <input type="checkbox" checked={newUser.funciones.includes(key)} onChange={() => toggleNewUserFuncion(key)} />
                  {label}
                </label>
              ))}
            </div>
          </div>
          <button className="btn-primary" type="submit">Registrar usuario</button>
        </form>
      </details>
    </div>
  );
}
