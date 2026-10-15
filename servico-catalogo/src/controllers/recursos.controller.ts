import { Request, Response } from "express";
import { RecursosService } from "../services/recursos.service";

const recursosService = new RecursosService();

export class RecursosController {
  listar(req: Request, res: Response) {
    const { tipo, status } = req.query;
    const recursos = recursosService.listar(tipo as string, status as string);
    return res.json(recursos);
  }

  buscarPorId(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ mensagem: "O id precisa ser número", status: 400, origem: "servico-catalogo" });
    }
    const recurso = recursosService.buscarPorId(id);
    return res.json(recurso);
  }

  criar(req: Request, res: Response) {
    const novoRecurso = recursosService.criar(req.body);
    return res.status(201).json(novoRecurso);
  }

  atualizarStatus(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ mensagem: "O id precisa ser número", status: 400, origem: "servico-catalogo" });
    }
    const { status } = req.body;
    const recurso = recursosService.atualizarStatus(id, status);
    return res.json(recurso);
  }
}
