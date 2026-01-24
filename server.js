import express from "express";
import mlAuth from "./src/routes/mlAuth.js";

const app = express();

app.use(express.json());

// TODAS AS ROTAS ML NASCEM AQUI
app.use("/", mlAuth);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor rodando na porta", PORT);
});
