import { Router } from "express";
import {
  getUsers,
  createUser,
  updateUserRole,
  updateUserFunciones,
  createTeam,
  updateTeam,
  deleteTeam,
  assignTeam,
  getTeams,
} from "../controllers/admin.controller.js";
import kitRoutes from "./kit.routes.js";
import { authenticate, authorizeRoles } from "../middlewares/auth.middleware.js";

const router = Router();

// esto es para solicitar el rol de admin
router.use(authenticate, authorizeRoles("admin"));

// Usuarios
router.get("/users", getUsers);
router.post("/users", createUser);
router.patch("/users/:id/role", updateUserRole);
router.patch("/users/:id/funciones", updateUserFunciones);

// Equipos  
router.get("/teams", getTeams);
router.post("/teams", createTeam);
router.post("/teams/assign", assignTeam);
router.put("/teams/:id", updateTeam);
router.delete("/teams/:id", deleteTeam);

// Inventario de kits
router.use("/kits", kitRoutes);

export default router;
