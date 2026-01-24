const express = require("express");

const mlAuthRoutes = require("./routes/mlAuth");

const app = express();

app.use(express.json());

// rotas Mercado Livre
app.use("/ml", mlAuthRoutes);

// healthcheck Railway
app.get("/", (req, res) => {
  res.status(200).send("API ONLINE");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 Server rodando na porta", PORT);
});
