import { Router } from "express";
import { RecursosController } from "../controllers/recursos.controller";
import { verificarToken } from "../middlewares/verificarToken";

const recursosRoutes = Router();
const controller = new RecursosController();

recursosRoutes.get("/", (req, res) => controller.listar(req, res));
recursosRoutes.get("/:id", (req, res) => controller.buscarPorId(req, res));
recursosRoutes.post("/", (req, res) => controller.criar(req, res));
recursosRoutes.patch("/:id/status", verificarToken, (req, res) => controller.atualizarStatus(req, res));

export { recursosRoutes };