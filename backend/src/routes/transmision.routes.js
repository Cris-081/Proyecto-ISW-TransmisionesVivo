import { Router } from "express";
import {
  getDisponibilidad,
  createTransmision,
  getTransmisionesPorMes,
} from "../controllers/transmision.controller.js";
import { soloGestion } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/disponibilidad", getDisponibilidad); // ?fecha=2026-10-20  (Req. 1)
router.post("/", soloGestion, createTransmision); // reservar horario   (Req. 1)
router.get("/", getTransmisionesPorMes);          // ?anio=2026&mes=10  (Req. 2)

export default router;
