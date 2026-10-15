import { agendamentosRepository, Agendamento } from "../repositories/agendamentos.repository";
import { buscarRecursoNoCatalogo } from "../clients/catalogo.client";
import { AppError } from "../errors/AppError";

export class AgendamentosService {
  listar(curso?: string, status?: string): Agendamento[] {
    return agendamentosRepository.findAll(curso, status);
  }

  buscarPorId(id: number): Agendamento {
    const agendamento = agendamentosRepository.findById(id);
    if (!agendamento) {
      throw new AppError("Agendamento não encontrado", 404);
    }
    return agendamento;
  }

  async criar(dados: {
    solicitante: string;
    curso: string;
    recursoId: any;
    data: string;
    horario: string;
    finalidade: string;
  }) {
    if (!dados.solicitante || !dados.curso || !dados.recursoId || !dados.data || !dados.horario || !dados.finalidade) {
      throw new AppError("Campos obrigatórios ausentes", 400);
    }

    const recursoIdNum = Number(dados.recursoId);
    if (isNaN(recursoIdNum)) {
      throw new AppError("recursoId precisa ser um número", 400);
    }

    // Consulta externa ao Catálogo
    const recurso = await buscarRecursoNoCatalogo(recursoIdNum);

    // Validação de regra de negócio
    if (recurso.status !== "disponivel") {
      throw new AppError(`Recurso em estado '${recurso.status}' não pode ser reservado`, 409);
    }

    const reserva = agendamentosRepository.create({
      solicitante: dados.solicitante,
      curso: dados.curso,
      recursoId: recursoIdNum,
      data: dados.data,
      horario: dados.horario,
      finalidade: dados.finalidade
    });

    return {
      id: reserva.id,
      solicitante: reserva.solicitante,
      curso: reserva.curso,
      recurso: {
        id: recurso.id,
        nome: recurso.nome,
        local: recurso.local
      },
      data: reserva.data,
      horario: reserva.horario,
      status: reserva.status
    };
  }

  atualizarStatus(id: number, status: string): Agendamento {
    if (!["pendente", "confirmado", "cancelado"].includes(status)) {
      throw new AppError("Status inválido. Use 'pendente', 'confirmado' ou 'cancelado'", 400);
    }

    const agendamento = agendamentosRepository.updateStatus(id, status as any);
    if (!agendamento) {
      throw new AppError("Agendamento não encontrado", 404);
    }

    return agendamento;
  }

  remover(id: number): void {
    const removido = agendamentosRepository.delete(id);
    if (!removido) {
      throw new AppError("Agendamento não encontrado", 404);
    }
  }
}