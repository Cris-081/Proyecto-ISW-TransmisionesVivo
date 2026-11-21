import { useCallback, useEffect, useState } from "react";
import { getUsers, getTeams } from "../services/admin.service.js";
import { getErrorMessage } from "../helpers/errors.js";

// Carga usuarios y equipos y comparte el error y la funcion run con las pantallas de administracion
export function useAdminData() {
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState("");

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

  return { users, teams, error, setError, loadData, run };
}
