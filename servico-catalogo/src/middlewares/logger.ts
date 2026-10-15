import { Request, Response, NextFunction } from "express";

export function logger(req: Request, res: Response, next: NextFunction) {
  console.log(`[CATÁLOGO] ${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
}