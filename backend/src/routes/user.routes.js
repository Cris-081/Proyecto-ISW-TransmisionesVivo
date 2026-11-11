import { Router } from "express";
import { getUserById } from "../controllers/user.controller.js";
import { authenticate, authorizeSelfOrRoles } from "../middlewares/auth.middleware.js";

const router = Router();

// Un usuario solo puede ver solo lo suyo o pero el rol admin y coordinador pueden ver cualquier cosa
router.get("/:id", authenticate, authorizeSelfOrRoles("id", "admin", "coordinador"), getUserById);

export default router;
