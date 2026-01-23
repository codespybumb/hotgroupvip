const express = require("express");

const mlAuthRoutes = require("./routes/mlAuth");

const app = express();

app.use(express.json());

// ROTA MERCADO LIVRE
app.use("/ml", mlAuthRoutes);

// healthcheck (Railway gosta disso)
app.get("/", (req, res) => {
  res.send("API ONLINE");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 Server rodando na porta", PORT);
});
