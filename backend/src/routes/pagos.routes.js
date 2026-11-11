import { Router } from "express";
import { getPagosService } from "../services/pagos.service.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    res.json({ data: await getPagosService(req.query.filtro || "todos") });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

export default router;