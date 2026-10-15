import express from "express";
import { recursosRoutes } from "./routes/recursos.routes";
import { errorHandler } from "./middlewares/errorHandler";
import { logger } from "./middlewares/logger";

const app = express();
app.use(express.json());
app.use(logger);

app.use("/recursos", recursosRoutes);

app.use(errorHandler);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Catálogo rodando em http://localhost:${PORT}`);
});