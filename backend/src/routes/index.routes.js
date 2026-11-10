import { Router } from "express";
import transmisionRoutes from "./transmision.routes.js";
import coberturaRoutes from "./cobertura.routes.js";

const router = Router();

router.use("/transmisiones", transmisionRoutes);
router.use("/cobertura", coberturaRoutes);

export default router;