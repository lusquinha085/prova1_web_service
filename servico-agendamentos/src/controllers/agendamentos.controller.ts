import { Request, Response } from "express";
import { AgendamentosService } from "../services/agendamentos.service";

const service = new AgendamentosService();

export class AgendamentosController {
  listar(req: Request, res: Response) {
    const { curso, status } = req.query;
    const agendamentos = service.listar(curso as string, status as string);
    return res.json(agendamentos);
  }

  buscarPorId(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ mensagem: "O id precisa ser número", status: 400, origem: "servico-agendamentos" });
    }
    const agendamento = service.buscarPorId(id);
    return res.json(agendamento);
  }

  async criar(req: Request, res: Response) {
    const resultado = await service.criar(req.body);
    return res.status(201).json(resultado);
  }

  atualizarStatus(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ mensagem: "O id precisa ser número", status: 400, origem: "servico-agendamentos" });
    }
    const { status } = req.body;
    const agendamento = service.atualizarStatus(id, status);
    return res.json(agendamento);
  }

  remover(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ mensagem: "O id precisa ser número", status: 400, origem: "servico-agendamentos" });
    }
    service.remover(id);
    return res.status(204).send();
  }
}