import { AppError } from "../errors/AppError";

export type RecursoCatalogo = {
  id: number;
  nome: string;
  tipo: "laboratorio" | "equipamento";
  local: string;
  status: "disponivel" | "manutencao" | "indisponivel";
};

export async function buscarRecursoNoCatalogo(recursoId: number): Promise<RecursoCatalogo> {
  try {
    const resposta = await fetch(`http://localhost:3001/recursos/${recursoId}`);

    if (resposta.status === 404) {
      throw new AppError("Recurso não encontrado no catálogo", 404);
    }

    if (!resposta.ok) {
      throw new AppError("Falha na integração com o catálogo", 502);
    }

    return (await resposta.json()) as RecursoCatalogo;
  } catch (error: any) {
    if (error instanceof AppError) throw error;
    throw new AppError("Serviço de catálogo fora do ar ou inacessível", 502);
  }
}
