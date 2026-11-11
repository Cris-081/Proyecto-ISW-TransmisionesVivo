import { Router } from "express";
import {
  getCoberturaHoyService,
  getCatalogoService,
  asignarService,
} from "../services/cobertura.service.js";
import { soloGestion } from "../middlewares/auth.middleware.js";

const router = Router();
const fail = (res, e) => res.status(400).json({ message: e.message });

router.get("/hoy", async (req, res) => {
  try { res.json({ data: await getCoberturaHoyService() }); } catch (e) { fail(res, e); }
});

router.get("/catalogo", async (req, res) => {
  try { res.json({ data: await getCatalogoService() }); } catch (e) { fail(res, e); }
});

router.post("/:id/asignar", soloGestion, async (req, res) => {
  try {
    const { trabajadorIds, equipoIds } = req.body;
    await asignarService(req.params.id, trabajadorIds, equipoIds);
    res.json({ data: true });
  } catch (e) { fail(res, e); }
});

export default router;