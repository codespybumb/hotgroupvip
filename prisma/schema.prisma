import express from "express";
import axios from "axios";
import prisma from "../prisma.js";

const router = express.Router();

/**
 * LOGIN ML
 */
router.get("/login", (req, res) => {
  const url =
    "https://auth.mercadolivre.com.br/authorization" +
    "?response_type=code" +
    `&client_id=${process.env.ML_CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(process.env.ML_REDIRECT_URI)}`;

  res.redirect(url);
});

/**
 * CALLBACK ML
 */
router.get("/callback", async (req, res) => {
  const code = req.query.code;

  if (!code || typeof code !== "string") {
    return res.status(400).send("❌ Code inválido ou ausente");
  }

  console.log("🔁 CALLBACK ML RECEBIDO");

  let tokenResponse;

  try {
    tokenResponse = await axios.post(
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
          Accept: "application/json",
        },
      }
    );
  } catch (err) {
    console.error("❌ ERRO OAUTH ML:", err.response?.data || err.message);
    return res.status(400).send("❌ Erro ao autorizar Mercado Livre");
  }

  const { access_token, refresh_token, user_id, expires_in } = tokenResponse.data;

  const expiresAt = new Date(Date.now() + expires_in * 1000);

  try {
    await prisma.mlAuth.upsert({
      where: { mlUserId: BigInt(user_id) },
      update: {
        accessToken: access_token,
        refreshToken: refresh_token,
        expiresAt,
      },
      create: {
        mlUserId: BigInt(user_id),
        accessToken: access_token,
        refreshToken: refresh_token,
        expiresAt,
      },
    });
  } catch (dbErr) {
    console.error("❌ ERRO AO SALVAR TOKEN:", dbErr.message);
    return res.status(500).send("❌ Erro ao salvar token no banco");
  }

  console.log("✅ TOKEN ML SALVO COM SUCESSO");

  res.send("✅ Mercado Livre conectado com sucesso");
});

export default router;
