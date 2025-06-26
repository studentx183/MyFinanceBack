import express from "express";
import cors from "cors";
import transactionsRoutes from "./routes/transactions";
import { setupSwagger } from "./swagger";

const app = express();
app.use(cors());
app.use(express.json());

setupSwagger(app);

app.use("/transactions", transactionsRoutes);

export default app;
