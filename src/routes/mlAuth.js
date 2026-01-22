import express from "express";

const router = express.Router();

router.get("/login", (req, res) => {
  const url =
    "https://auth.mercadolivre.com.br/authorization" +
    "?response_type=code" +
    `&client_id=${process.env.ML_CLIENT_ID}` +
    `&redirect_uri=${process.env.ML_REDIRECT_URI}`;

  res.redirect(url);
});

export default router;

import axios from "axios";

router.get("/callback", async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send("Code não recebido");
  }

  try {
    const response = await axios.post(
      "https://api.mercadolibre.com/oauth/token",
      {
        grant_type: "authorization_code",
        client_id: process.env.ML_CLIENT_ID,
        client_secret: process.env.ML_CLIENT_SECRET,
        code,
        redirect_uri: process.env.ML_REDIRECT_URI,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const { access_token, refresh_token, user_id, expires_in } = response.data;

    // 👉 depois a gente salva no banco
    console.log("TOKEN ML:", access_token);

    res.send("Mercado Livre conectado com sucesso ✅");
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).send("Erro ao autenticar no Mercado Livre");
  }
});
