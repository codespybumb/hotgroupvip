import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.status(200).send("API ONLINE");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("🚀 Server rodando na porta", PORT);
});
