import { Router } from "express";
import transmisionRoutes from "./transmision.routes.js";
import coberturaRoutes from "./cobertura.routes.js";
import tarifasRoutes from "./tarifas.routes.js";

const router = Router();

router.use("/transmisiones", transmisionRoutes);
router.use("/cobertura", coberturaRoutes);
router.use("/tarifas", tarifasRoutes);

export default router;