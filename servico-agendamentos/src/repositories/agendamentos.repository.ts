export type Agendamento = {
  id: number;
  solicitante: string;
  curso: string;
  recursoId: number;
  data: string;
  horario: string;
  finalidade: string;
  status: "pendente" | "confirmado" | "cancelado";
};

class AgendamentosRepository {
  private agendamentos: Agendamento[] = [];

  findAll(curso?: string, status?: string): Agendamento[] {
    return this.agendamentos.filter((a) => {
      let matches = true;
      if (curso) matches = matches && a.curso.toLowerCase() === curso.toLowerCase();
      if (status) matches = matches && a.status === status;
      return matches;
    });
  }

  findById(id: number): Agendamento | undefined {
    return this.agendamentos.find((a) => a.id === id);
  }

  create(data: Omit<Agendamento, "id" | "status">): Agendamento {
    const newId = this.agendamentos.length > 0 ? Math.max(...this.agendamentos.map((a) => a.id)) + 1 : 1;
    const novoAgendamento: Agendamento = { id: newId, ...data, status: "confirmado" };
    this.agendamentos.push(novoAgendamento);
    return novoAgendamento;
  }

  updateStatus(id: number, status: "pendente" | "confirmado" | "cancelado"): Agendamento | undefined {
    const agendamento = this.findById(id);
    if (agendamento) {
      agendamento.status = status;
      return agendamento;
    }
    return undefined;
  }

  delete(id: number): boolean {
    const index = this.agendamentos.findIndex((a) => a.id === id);
    if (index !== -1) {
      this.agendamentos.splice(index, 1);
      return true;
    }
    return false;
  }
}

export const agendamentosRepository = new AgendamentosRepository();