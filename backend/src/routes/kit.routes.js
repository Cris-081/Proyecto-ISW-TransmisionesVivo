import { Router } from "express";
import { getKits, getKit, createKit, updateKit, deleteKit, assignKit, releaseKit } from "../controllers/kit.controller.js";

const router = Router();

router.get("/", getKits);
router.post("/", createKit);
router.get("/:id", getKit);
router.put("/:id", updateKit);
router.delete("/:id", deleteKit);
router.post("/:id/asignar", assignKit);
router.post("/:id/liberar", releaseKit);

export default router;
