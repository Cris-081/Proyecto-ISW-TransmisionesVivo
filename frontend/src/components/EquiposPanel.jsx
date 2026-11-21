import { useState } from "react";
import { createTeam, updateTeam, deleteTeam } from "../services/admin.service.js";
import { useAdminData } from "../hooks/useAdminData.js";
import { getErrorMessage } from "../helpers/errors.js";
import "../styles/Admin.css";

export default function EquiposPanel() {
  const { users, teams, error, setError, loadData, run } = useAdminData();
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamDesc, setNewTeamDesc] = useState("");
  const [newTeamMembers, setNewTeamMembers] = useState([]);
  const [aviso, setAviso] = useState("");
  const [editingTeam, setEditingTeam] = useState(null);

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
          setAviso("Equipo creado. No se enviaron correos porque el servidor de correo no esta configurado (revisa MAIL_USER y MAIL_PASS en el .env del backend).");
        } else if (n.fallidos.length) {
          // se muestra el motivo real que devuelve el servidor de correo
          setAviso(
            `Equipo creado. Correos enviados: ${n.enviados}. No se pudo avisar a: ${n.fallidos.map((f) => `${f.nombre} (${f.email}) - ${f.motivo}`).join(" | ")}`
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

  return (
    <div className="admin-panel">
      <h1>Equipos</h1>

      {error && (
        <p className="alert-error" role="alert">
          {error}
        </p>
      )}

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
