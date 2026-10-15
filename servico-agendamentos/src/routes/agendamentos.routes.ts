import { Router } from "express";
import { AgendamentosController } from "../controllers/agendamentos.controller";
import { verificarToken } from "../middlewares/verificarToken";

const agendamentosRoutes = Router();
const controller = new AgendamentosController();

agendamentosRoutes.get("/", (req, res) => controller.listar(req, res));
agendamentosRoutes.get("/:id", (req, res) => controller.buscarPorId(req, res));
agendamentosRoutes.post("/", (req, res, next) => controller.criar(req, res).catch(next));
agendamentosRoutes.patch("/:id/status", verificarToken, (req, res) => controller.atualizarStatus(req, res));
agendamentosRoutes.delete("/:id", verificarToken, (req, res) => controller.remover(req, res));

export { agendamentosRoutes };