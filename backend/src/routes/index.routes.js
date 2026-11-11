import { Router } from "express";
import authRoutes from "./auth.routes.js";
import adminRoutes from "./admin.routes.js";
import userRoutes from "./user.routes.js";
import transmisionRoutes from "./transmision.routes.js";
import coberturaRoutes from "./cobertura.routes.js";
import tarifasRoutes from "./tarifas.routes.js";
import pagosRoutes from "./pagos.routes.js";
import { authenticate, soloGestion } from "../middlewares/auth.middleware.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);
router.use("/users", userRoutes);

// Cobertura de transmisiones: todas piden sesion; tarifas y pagos solo admin y coordinador
router.use("/transmisiones", authenticate, transmisionRoutes);
router.use("/cobertura", authenticate, coberturaRoutes);
router.use("/tarifas", authenticate, soloGestion, tarifasRoutes);
router.use("/pagos", authenticate, soloGestion, pagosRoutes);

export default router;
