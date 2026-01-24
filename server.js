const express = require("express");
const mlAuthRoutes = require("./src/routes/mlAuth");

const app = express();

app.use(express.json());

// Healthcheck (Railway usa isso)
app.get("/", (req, res) => {
  res.send("API ONLINE");
});

// Rotas Mercado Livre
app.use("/ml", mlAuthRoutes);

const PORT = process.env.PORT;

app.listen(PORT, "0.0.0.0", () => {
  console.log("🚀 Server rodando na porta", PORT);
});
