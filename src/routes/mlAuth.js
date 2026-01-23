import express from "express";
import axios from "axios";

const router = express.Router();

/**
 * ROTA 1 — INICIAR LOGIN MERCADO LIVRE
 * Envia o usuário para o OAuth do ML
 */
router.get("/ml/auth", (req, res) => {
  const clientId = process.env.ML_CLIENT_ID;
  const redirectUri = process.env.ML_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    return res.status(500).json({
      error: "ML_CLIENT_ID ou ML_REDIRECT_URI não configurado",
    });
  }

  const authUrl =
    `https://auth.mercadolivre.com.br/authorization` +
    `?response_type=code` +
    `&client_id=${clientId}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}`;

  res.redirect(authUrl);
});

/**
 * ROTA 2 — CALLBACK / LOGIN
 * Recebe o ?code e troca por access_token
 */
router.get("/ml/login", async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({
      error: "code ausente",
    });
  }

  try {
    const tokenResponse = await axios.post(
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

    const {
      access_token,
      refresh_token,
      user_id,
      expires_in,
    } = tokenResponse.data;

    /**
     * 👉 AQUI você salva no banco
     * Exemplo:
     * await saveMlToken({ user_id, access_token, refresh_token, expires_in })
     */

    return res.json({
      success: true,
      user_id,
      access_token,
      refresh_token,
      expires_in,
    });
  } catch (err) {
    console.error(
      "Erro ao trocar token ML:",
      err.response?.data || err.message
    );

    return res.status(500).json({
      error: "Erro ao autenticar no Mercado Livre",
      details: err.response?.data || err.message,
    });
  }
});

export default router;
