import { Router } from "express";
import transmisionRoutes from "./transmision.routes.js";

const router = Router();

router.use("/transmisiones", transmisionRoutes);

export default router;
