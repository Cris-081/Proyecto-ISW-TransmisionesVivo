import { Router } from "express";
import { getUsers, updateUserRole, createTeam, assignTeam, getTeams} from "../controllers/admin.controller.js";

const router = Router();

router.get("/users", getUsers);
router.patch("/users/:id/role", updateUserRole);
router.post("/teams", createTeam);
router.get("/teams", getTeams);
router.post("/teams/assign", assignTeam);

export default router;