import express from "express";
import mlAuth from "./src/mlAuth.js";

const app = express();        // 1️⃣ cria o app
app.use(express.json());     // 2️⃣ middlewares base

app.use("/ml", mlAuth);      // 3️⃣ rotas

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("🤖 Bot iniciado");
});
