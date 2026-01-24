import express from "express";
import mlAuthRoutes from "./src/routes/mlAuth.js";

const app = express();

app.use(express.json());

// rota mercado livre
app.use("/ml", mlAuthRoutes);

// healthcheck (OBRIGATÓRIO)
app.get("/", (req, res) => {
  res.status(200).send("API ONLINE");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("🚀 Server rodando na porta", PORT);
});
