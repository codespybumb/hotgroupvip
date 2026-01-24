import express from "express";
import axios from "axios";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

/**
 * GET /ml/auth
 * Redireciona para o Mercado Livre OAuth
 */
router.get("/auth", (req, res) => {
  const redirectUri = process.env.ML_REDIRECT_URI;

  if (!redirectUri) {
    return res.status(500).json({ error: "ML_REDIRECT_URI não configurado" });
  }

  const url =
    "https://auth.mercadolivre.com.br/authorization" +
    "?response_type=code" +
    `&client_id=${process.env.ML_CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}`;

  return res.redirect(url);
});

/**
 * GET /ml/callback
 * Recebe o code e salva o token
 */
router.get("/callback", async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: "code ausente" });
  }

  try {
    const { data } = await axios.post(
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

    const expiresAt = new Date(Date.now() + data.expires_in * 1000);

    await prisma.mercadoLivreToken.upsert({
      where: { userId: data.user_id },
      update: {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        scope: data.scope,
        expiresAt,
      },
      create: {
        userId: data.user_id,
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        scope: data.scope,
        expiresAt,
      },
    });

    return res.json({
      success: true,
      user_id: data.user_id,
      expires_at: expiresAt,
    });
  } catch (err) {
    console.error("ML CALLBACK ERROR:", err.response?.data || err.message);

    return res.status(500).json({
      error: "Erro ao salvar token",
      details: err.response?.data || err.message,
    });
  }
});

export default router;
