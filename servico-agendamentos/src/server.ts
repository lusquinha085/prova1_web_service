import express from "express";
import { agendamentosRoutes } from "./routes/agendamentos.routes";
import { errorHandler } from "./middlewares/errorHandler";
import { logger } from "./middlewares/logger";

const app = express();
app.use(express.json());
app.use(logger);

app.use("/agendamentos", agendamentosRoutes);

app.use(errorHandler);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Agendamentos rodando em http://localhost:${PORT}`);
});