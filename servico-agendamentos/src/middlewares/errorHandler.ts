import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      mensagem: err.message,
      status: err.statusCode,
      origem: "servico-agendamentos"
    });
  }

  return res.status(500).json({
    mensagem: "Erro interno no serviço de agendamentos",
    status: 500,
    origem: "servico-agendamentos"
  });
}