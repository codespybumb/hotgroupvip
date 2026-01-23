import express from "express";
import axios from "axios";
import prisma from "../prisma.js";

const router = express.Router();

// LOGIN
router.get("/login", (req, res) => {
  const url =
    "https://auth.mercadolivre.com.br/authorization" +
    "?response_type=code" +
    `&client_id=${process.env.ML_CLIENT_ID}` +
    `&redirect_uri=${process.env.ML_REDIRECT_URI}`;

  res.redirect(url);
});

// CALLBACK
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
        headers: { "Content-Type": "application/json" },
      }
    );

    const { access_token, refresh_token, user_id, expires_in } = response.data;

    const expiresAt = new Date(Date.now() + expires_in * 1000);

    // salva no banco
    await prisma.mlAuth.upsert({
      where: { mlUserId: BigInt(user_id) },
      update: {
        accessToken: access_token,
        refreshToken: refresh_token,
        expiresAt: expiresAt,
      },
      create: {
        mlUserId: BigInt(user_id),
        accessToken: access_token,
        refreshToken: refresh_token,
        expiresAt: expiresAt,
      },
    });

    res.send("Mercado Livre conectado e salvo no banco ✅");

  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).send("Erro ao autenticar no Mercado Livre");
  }
});

export default router;
