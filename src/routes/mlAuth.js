import express from "express";
import axios from "axios";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

router.get("/ml/auth", (req, res) => {
  const url =
    "https://auth.mercadolivre.com.br/authorization" +
    "?response_type=code" +
    `&client_id=${process.env.ML_CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(process.env.ML_REDIRECT_URI)}`;

  res.redirect(url);
});

router.get("/ml/callback", async (req, res) => {
  const { code } = req.query;
  if (!code) return res.status(400).json({ error: "code ausente" });

  try {
    const { data } = await axios.post(
      "https://api.mercadolibre.com/oauth/token",
      {
        grant_type: "authorization_code",
        client_id: process.env.ML_CLIENT_ID,
        client_secret: process.env.ML_CLIENT_SECRET,
        code,
        redirect_uri: process.env.ML_REDIRECT_URI,
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

    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({
      error: "Erro ao salvar token",
      details: err.response?.data || err.message,
    });
  }
});

export default router;
