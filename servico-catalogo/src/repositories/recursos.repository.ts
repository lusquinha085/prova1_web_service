export type Recurso = {
  id: number;
  nome: string;
  tipo: "laboratorio" | "equipamento";
  local: string;
  status: "disponivel" | "manutencao" | "indisponivel";
};

class RecursosRepository {
  private recursos: Recurso[] = [
    { id: 1, nome: "Laboratório 1", tipo: "laboratorio", local: "Bloco A", status: "disponivel" },
    { id: 2, nome: "Laboratório 3", tipo: "laboratorio", local: "Bloco B", status: "disponivel" },
    { id: 3, nome: "Projetor Epson", tipo: "equipamento", local: "Armário 2", status: "manutencao" }
  ];

  findAll(tipo?: string, status?: string): Recurso[] {
    return this.recursos.filter((r) => {
      let matches = true;
      if (tipo) matches = matches && r.tipo === tipo;
      if (status) matches = matches && r.status === status;
      return matches;
    });
  }

  findById(id: number): Recurso | undefined {
    return this.recursos.find((r) => r.id === id);
  }

  create(data: Omit<Recurso, "id">): Recurso {
    const newId = this.recursos.length > 0 ? Math.max(...this.recursos.map((r) => r.id)) + 1 : 1;
    const novoRecurso: Recurso = { id: newId, ...data };
    this.recursos.push(novoRecurso);
    return novoRecurso;
  }

  updateStatus(id: number, status: "disponivel" | "manutencao" | "indisponivel"): Recurso | undefined {
    const recurso = this.findById(id);
    if (recurso) {
      recurso.status = status;
      return recurso;
    }
    return undefined;
  }
}

export const recursosRepository = new RecursosRepository();