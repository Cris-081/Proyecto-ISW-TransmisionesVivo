import { useCallback, useEffect, useState } from "react";
import {
  getUsers,
  createUser,
  updateUserRole,
  updateUserFunciones,
  getTeams,
  createTeam,
  updateTeam,
  deleteTeam,
  assignUserToTeam,
} from "../services/admin.service.js";
import { FUNCIONES } from "../helpers/labels.js";
import { getErrorMessage } from "../helpers/errors.js";
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

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState("");
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamDesc, setNewTeamDesc] = useState("");
  const [newTeamMembers, setNewTeamMembers] = useState([]);
  const [aviso, setAviso] = useState("");
  const [editingTeam, setEditingTeam] = useState(null);
  const [newUser, setNewUser] = useState(EMPTY_USER);

  const loadData = useCallback(async () => {
    try {
      const [usersData, teamsData] = await Promise.all([getUsers(), getTeams()]);
      setUsers(usersData.data || []);
      setTeams(teamsData.data || []);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Ejecuta una accion, muestra el error si falla y recarga los datos si sale bien
  const run = async (action) => {
    setError("");
    try {
      await action();
      await loadData();
      return true;
    } catch (err) {
      setError(getErrorMessage(err));
      return false;
    }
  };

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

  const toggleNewTeamMember = (userId) =>
    setNewTeamMembers((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]));

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;
    setAviso("");
    setError("");
    try {
      const res = await createTeam(newTeamName, newTeamDesc, newTeamMembers);
      const n = res.data?.notificaciones;
      if (newTeamMembers.length && n) {
        if (!n.configurado) {
          setAviso("Equipo creado. No se enviaron correos porque el servidor de correo no esta configurado.");
        } else if (n.fallidos.length) {
          setAviso(
            `Equipo creado. Correos enviados: ${n.enviados}. No se pudo avisar a: ${n.fallidos.map((f) => `${f.nombre} (${f.email})`).join(", ")}.`
          );
        } else {
          setAviso(`Equipo creado. Se envio un correo a ${n.enviados} integrante(s).`);
        }
      } else {
        setAviso("Equipo creado.");
      }
      setNewTeamName("");
      setNewTeamDesc("");
      setNewTeamMembers([]);
      await loadData();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleSaveTeam = async (e) => {
    e.preventDefault();
    const ok = await run(() => updateTeam(editingTeam.id, editingTeam.name, editingTeam.description));
    if (ok) setEditingTeam(null);
  };

  const handleDeleteTeam = (team) => {
    if (!window.confirm(`Eliminar el equipo "${team.name}"? Sus integrantes quedaran sin equipo.`)) return;
    run(() => deleteTeam(team.id));
  };

  const setUserField = (field, value) => setNewUser((prev) => ({ ...prev, [field]: value }));

  const toggleNewUserFuncion = (funcion) =>
    setNewUser((prev) => ({
      ...prev,
      funciones: prev.funciones.includes(funcion)
        ? prev.funciones.filter((f) => f !== funcion)
        : [...prev.funciones, funcion],
    }));

  const handleCreateUser = async (e) => {
    e.preventDefault();
    const ok = await run(() => createUser(newUser));
    if (ok) setNewUser(EMPTY_USER);
  };

  return (
    <div className="admin-panel">
      <h1>Usuarios y equipos</h1>

      {error && (
        <p className="alert-error" role="alert">
          {error}
        </p>
      )}

      <h2>Usuarios</h2>
      <div className="admin-users-table-wrap">
        <table className="admin-users-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol de acceso</th>
              <th>Funciones</th>
              <th>Equipo</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.nombre}</td>
                <td>{user.email}</td>
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

      <section className="team-roster">
        <h2>Equipos de trabajo</h2>
        {teams.length ? (
          <ul className="team-roster-list">
            {teams.map((team) => (
              <li key={team.id} className="team-roster-item">
                {editingTeam?.id === team.id ? (
                  <form className="inline-form" onSubmit={handleSaveTeam}>
                    <input
                      aria-label="Nombre del equipo"
                      value={editingTeam.name}
                      onChange={(e) => setEditingTeam({ ...editingTeam, name: e.target.value })}
                      required
                    />
                    <input
                      aria-label="Descripcion del equipo"
                      value={editingTeam.description || ""}
                      onChange={(e) => setEditingTeam({ ...editingTeam, description: e.target.value })}
                    />
                    <button className="btn-small primary" type="submit">Guardar</button>
                    <button className="btn-small" type="button" onClick={() => setEditingTeam(null)}>Cancelar</button>
                  </form>
                ) : (
                  <>
                    <div className="team-roster-heading">
                      <h3>{team.name}</h3>
                      <span>{team.members?.length || 0} integrantes</span>
                    </div>
                    {team.description && <p>{team.description}</p>}
                    <p className="team-roster-members">
                      {team.members?.length ? team.members.map((m) => m.nombre).join(", ") : "Sin integrantes"}
                    </p>
                    <p>
                      {team.kits?.length
                        ? `Kits asignados: ${team.kits.map((k) => k.nombre).join(", ")}`
                        : "Sin kits asignados"}
                    </p>
                    <div className="row-actions">
                      <button className="btn-small" type="button" onClick={() => setEditingTeam({ id: team.id, name: team.name, description: team.description })}>
                        Editar
                      </button>
                      <button className="btn-small danger" type="button" onClick={() => handleDeleteTeam(team)}>
                        Eliminar
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="muted">Todavia no hay equipos creados.</p>
        )}
      </section>

      <h2>Crear Nuevo Equipo</h2>
      <form className="login-form admin-team-form" onSubmit={handleCreateTeam}>
        <div className="field">
          <label htmlFor="team-name">Nombre del equipo</label>
          <input
            id="team-name"
            type="text"
            placeholder="Ej. Produccion en vivo"
            value={newTeamName}
            onChange={(e) => setNewTeamName(e.target.value)}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="team-description">Descripcion</label>
          <input
            id="team-description"
            type="text"
            placeholder="Descripcion del equipo"
            value={newTeamDesc}
            onChange={(e) => setNewTeamDesc(e.target.value)}
          />
        </div>
        <div className="field">
          <label>Integrantes (recibiran un correo)</label>
          <div className="funciones-grid" role="group" aria-label="Integrantes del nuevo equipo">
            {users.map((user) => (
              <label key={user.id} className="check">
                <input
                  type="checkbox"
                  checked={newTeamMembers.includes(user.id)}
                  onChange={() => toggleNewTeamMember(user.id)}
                />
                {user.nombre}
              </label>
            ))}
          </div>
        </div>
        <button className="btn-primary" type="submit">Crear equipo</button>
        {aviso && <p className="alert-info" role="status">{aviso}</p>}
      </form>
    </div>
  );
}
