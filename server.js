const express = require("express");

const mlAuth = require("./src/routes/mlAuth");

const app = express();

app.use(express.json());

// Mercado Livre
app.use("/ml", mlAuth);

app.get("/", (req, res) => {
  res.send("API ONLINE");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("🚀 Server rodando na porta", PORT);
});
