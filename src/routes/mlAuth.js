import express from "express";
import prisma from "../prisma.js";
import { trocarCodePorToken } from "../mercadoLivre.js";

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
  if (!code) return res.status(400).send("Code ausente");

  try {
    const data = await trocarCodePorToken(code);

    const expiresAt = new Date(Date.now() + data.expires_in * 1000);

    await prisma.mercadoLivreToken.upsert({
      where: { userId: BigInt(data.user_id) },
      update: {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        scope: data.scope,
        expiresAt
      },
      create: {
        userId: BigInt(data.user_id),
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        scope: data.scope,
        expiresAt
      }
    });

    res.send("Mercado Livre conectado com sucesso 🚀");
  } catch (err) {
    console.error(err.response?.data || err);
    res.status(500).send("Erro ao autenticar ML");
  }
});

export default router;
