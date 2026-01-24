import express from "express";
import mlAuthRoutes from "./src/routes/mlAuth.js";

const app = express();

app.use(express.json());
app.use(mlAuthRoutes);

app.get("/", (req, res) => {
  res.status(200).send("API ONLINE 🚀");
});

const PORT = process.env.PORT || 5432;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Servidor rodando na porta", PORT);
});
