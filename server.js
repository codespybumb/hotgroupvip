import express from "express";
import mlAuthRoutes from "./src/routes/mlAuth.js";

const app = express();

app.use(express.json());

// rota ML
app.use("/ml", mlAuthRoutes);

// healthcheck
app.get("/", (req, res) => {
  res.status(200).send("API ONLINE");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 Server rodando na porta", PORT);
});
