import { recursosRepository, Recurso } from "../repositories/recursos.repository";
import { AppError } from "../errors/AppError";

export class RecursosService {
  listar(tipo?: string, status?: string): Recurso[] {
    return recursosRepository.findAll(tipo, status);
  }

  buscarPorId(id: number): Recurso {
    const recurso = recursosRepository.findById(id);
    if (!recurso) {
      throw new AppError("Recurso não encontrado", 404);
    }
    return recurso;
  }

  criar(dados: { nome: string; tipo: any; local: string; status: any }): Recurso {
    if (!dados.nome || !dados.tipo || !dados.local || !dados.status) {
      throw new AppError("Campos obrigatórios ausentes (nome, tipo, local, status)", 400);
    }

    if (!["laboratorio", "equipamento"].includes(dados.tipo)) {
      throw new AppError("Tipo inválido. Use 'laboratorio' ou 'equipamento'", 400);
    }

    if (!["disponivel", "manutencao", "indisponivel"].includes(dados.status)) {
      throw new AppError("Status inválido. Use 'disponivel', 'manutencao' ou 'indisponivel'", 400);
    }

    return recursosRepository.create(dados);
  }

  atualizarStatus(id: number, status: string): Recurso {
    if (!["disponivel", "manutencao", "indisponivel"].includes(status)) {
      throw new AppError("Status inválido. Use 'disponivel', 'manutencao' ou 'indisponivel'", 400);
    }

    const recursoAtualizado = recursosRepository.updateStatus(id, status as any);
    if (!recursoAtualizado) {
      throw new AppError("Recurso não encontrado", 404);
    }

    return recursoAtualizado;
  }
}