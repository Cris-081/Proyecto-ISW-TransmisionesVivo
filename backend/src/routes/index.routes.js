import { Router } from "express";
import transmisionRoutes from "./transmision.routes.js";
import coberturaRoutes from "./cobertura.routes.js";
import tarifasRoutes from "./tarifas.routes.js";
import pagosRoutes from "./pagos.routes.js";

const router = Router();

router.use("/transmisiones", transmisionRoutes);
router.use("/cobertura", coberturaRoutes);
router.use("/tarifas", tarifasRoutes);
router.use("/pagos", pagosRoutes);

export default router;