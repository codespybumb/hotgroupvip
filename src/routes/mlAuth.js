import express from "express";
import axios from "axios";

const router = express.Router();

/**
 * INICIAR LOGIN NO MERCADO LIVRE
 * ESSA ROTA NÃO EXISTIA ANTES
 */
router.get("/ml/auth", (req, res) => {
  const url =
    "https://auth.mercadolivre.com.br/authorization" +
    "?response_type=code" +
    `&client_id=${process.env.ML_CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(process.env.ML_REDIRECT_URI)}`;

  res.redirect(url);
});

/**
 * CALLBACK DO MERCADO LIVRE
 * ESSA ROTA NÃO EXISTIA ANTES
 */
router.get("/ml/login", async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: "code ausente" });
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
      }
    );

    return res.json(response.data);
  } catch (err) {
    return res.status(500).json({
      error: "Erro ao trocar code por token",
      details: err.response?.data || err.message,
    });
  }
});

export default router;
