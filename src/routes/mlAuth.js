const express = require("express");
const axios = require("axios");
const { prisma } = require("../prisma");

const router = express.Router();

/**
 * CALLBACK DO MERCADO LIVRE
 * URL cadastrada no ML:
 * https://hotgroupvip-production.up.railway.app/ml/callback
 */
router.get("/login", async (req, res) => {
  const code = req.query.code;
  const userId = req.query.state;

  if (!code || !userId) {
    return res.status(400).json({
      error: "code ou state ausente",
    });
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

    const data = response.data;

    const expiresAt = new Date(Date.now() + data.expires_in * 1000);

    await prisma.mercadoLivreToken.upsert({
      where: {
        userId: userId,
      },
      update: {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        tokenType: data.token_type,
        scope: data.scope,
        expiresAt: expiresAt,
      },
      create: {
        userId: userId,
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        tokenType: data.token_type,
        scope: data.scope,
        expiresAt: expiresAt,
      },
    });

    return res.json({
      success: true,
      message: "Token Mercado Livre salvo com sucesso",
    });
  } catch (error) {
    console.error(
      "❌ ERRO OAUTH ML:",
      error.response?.data || error.message
    );

    return res.status(500).json({
      error: "Erro ao salvar token Mercado Livre",
      details: error.response?.data || error.message,
    });
  }
});

module.exports = router;
