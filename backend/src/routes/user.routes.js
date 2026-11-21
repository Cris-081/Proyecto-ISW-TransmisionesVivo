import { Router } from "express";
import { getUserById, updateMe } from "../controllers/user.controller.js";
import { authenticate, authorizeSelfOrRoles } from "../middlewares/auth.middleware.js";

const router = Router();

// Cada usuario modifica solo su correo y telefono
router.patch("/me", authenticate, updateMe);

// Un usuario ve sus datos pero el admin puede ver lo de los todos
router.get("/:id", authenticate, authorizeSelfOrRoles("id", "admin", "coordinador"), getUserById);

export default router;
