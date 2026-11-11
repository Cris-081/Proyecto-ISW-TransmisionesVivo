import { Router } from "express";
import { getTarifasService } from "../services/tarifas.service.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    res.json({ data: await getTarifasService(req.query.tipo || "empresa") });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

export default router;