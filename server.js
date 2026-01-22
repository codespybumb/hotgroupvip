import express from "express";
import mlAuth from "./routes/mlAuth.js";

const app = express();

app.use(express.json());

app.use("/ml", mlAuth);

app.listen(process.env.PORT || 3000, () => {
  console.log("Servidor HTTP rodando");
});
