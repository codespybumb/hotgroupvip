import express from "express";
import mlAuth from "./src/routes/mlAuth.js";

const app = express();

app.use(express.json());
app.use(mlAuth);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor rodando na porta", PORT);
});
