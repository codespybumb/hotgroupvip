import express from "express";
import mlAuthRoutes from "./routes/mlAuth.js";

const app = express();

app.use(express.json());
app.use(mlAuthRoutes);

// 🔥 ROTA DE TESTE (OBRIGATÓRIA)
app.get("/", (req, res) => {
  res.send("API ONLINE 🚀");
});

// 🔥 PORTA DO RAILWAY
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Servidor rodando na porta", PORT);
});
