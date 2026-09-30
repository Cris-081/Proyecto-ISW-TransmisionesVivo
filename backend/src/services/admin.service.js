import { AppDataSource } from "../config/configDb.js";
import { User } from "../entities/user.entity.js";
import { Team } from "../entities/team.entity.js";

const userRepository = AppDataSource.getRepository(User);
const teamRepository = AppDataSource.getRepository(Team);


export const getAllUsersService = async () => {
  return await userRepository.find({ relations: { team: true } });
};


export const updateUserRoleService = async (userId, role) => {
  const user = await userRepository.findOne({ where: { id: userId } });
  if (!user) throw new Error("Usuario no encontrado");

  user.role = role;
  return await userRepository.save(user);
};


export const createTeamService = async (name, description) => {
  const newTeam = teamRepository.create({ name, description });
  return await teamRepository.save(newTeam);
};


export const assignUserToTeamService = async (userId, teamId) => {
  const user = await userRepository.findOne({ where: { id: userId } });
  if (!user) throw new Error("Usuario no encontrado");

  if (teamId) {
    const team = await teamRepository.findOne({ where: { id: teamId } });
    if (!team) throw new Error("Equipo no encontrado");
    user.team = team;
  } else {
    user.team = null; 
  }

  return await userRepository.save(user);
};


export const getAllTeamsService = async () => {
  return await teamRepository.find({ relations: { members: true } });
};