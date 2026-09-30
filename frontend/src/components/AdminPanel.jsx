import React, { useEffect, useState } from "react";
import { getUsers, updateUserRole, getTeams, createTeam, assignUserToTeam } from "../services/admin.service";

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamDesc, setNewTeamDesc] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const usersData = await getUsers();
      const teamsData = await getTeams();
      setUsers(usersData.data || []);
      setTeams(teamsData.data || []);
    } catch (err) {
      console.error("Error al cargar datos:", err);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    await updateUserRole(userId, newRole);
    loadData();
  };

  const handleTeamAssign = async (userId, teamId) => {
    await assignUserToTeam(userId, teamId ? Number(teamId) : null);
    loadData();
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    if (!newTeamName) return;
    await createTeam(newTeamName, newTeamDesc);
    setNewTeamName("");
    setNewTeamDesc("");
    loadData();
  };

  return (
    <div className="admin-panel">
      <h1>Panel de Administración</h1>
      <h2>Usuarios</h2>
      <div className="admin-users-table-wrap">
        <table className="admin-users-table">
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Rol</th>
                    <th>Equipo</th>
                </tr>
            </thead>
            <tbody>
                {users.map(user => (
                    <tr key={user.id}>
                        <td>{user.nombre}</td>
                        <td>{user.email}</td>
                        <td> 
                <select aria-label={`Rol de ${user.nombre}`} value={user.role} onChange={(e) => handleRoleChange(user.id, e.target.value)}>
                                <option value="admin">Admin</option>
                              <option value="coordinador">Coordinador</option>
                              <option value="operador">Operador</option>
                            </select>
                        </td>  
                        <td>
                <select aria-label={`Equipo de ${user.nombre}`} value={user.team ? user.team.id : ""} onChange={(e) => handleTeamAssign(user.id, e.target.value)}>
                                <option value="">Sin equipo</option>
                                {teams.map(team => (
                                    <option key={team.id} value={team.id}>{team.name}</option>
                                ))}
                            </select>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>

        <section className="team-roster">
          <h2>Equipos de trabajo</h2>
          {teams.length ? (
            <ul className="team-roster-list">
              {teams.map(team => (
                <li key={team.id} className="team-roster-item">
                  <div className="team-roster-heading">
                    <h3>{team.name}</h3>
                    <span>{team.members?.length || 0} integrantes</span>
                  </div>
                  {team.description && <p>{team.description}</p>}
                  <p className="team-roster-members">
                    {team.members?.length
                      ? team.members.map(member => member.nombre).join(", ")
                      : "Sin integrantes"}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted">Todavía no hay equipos creados.</p>
          )}
        </section>

        <h2>Crear Nuevo Equipo</h2>
        <form className="login-form admin-team-form" onSubmit={handleCreateTeam}>
          <div className="field">
            <label htmlFor="team-name">Nombre del equipo</label>
            <input
              id="team-name"
              type="text"
              placeholder="Ej. Producción en vivo"
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="team-description">Descripción</label>
            <input
              id="team-description"
              type="text"
              placeholder="Descripción del equipo"
              value={newTeamDesc}
              onChange={(e) => setNewTeamDesc(e.target.value)}
            />
          </div>
          <button className="btn-primary" type="submit">Crear equipo</button>
        </form>
    </div>
  );
}