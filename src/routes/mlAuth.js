import express from "express";
import axios from "axios";
import { prisma } from "../prisma.js";

const router = express.Router();

router.get("/login", async (req, res) => {
  const code = req.query.code;
  const userId = req.query.state;

  if (!code || !userId) {
    return res.status(400).json({ error: "code ou state ausente" });
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
      { headers: { "Content-Type": "application/json" } }
    );

    const expiresAt = new Date(Date.now() + data.expires_in * 1000);

    await prisma.mercadoLivreToken.upsert({
      where: { userId },
      update: {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        tokenType: data.token_type,
        scope: data.scope,
        expiresAt,
      },
      create: {
        userId,
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        tokenType: data.token_type,
        scope: data.scope,
        expiresAt,
      },
    });

    res.json({ success: true });
  } catch (err) {
    console.error("❌ ML AUTH ERROR:", err.response?.data || err.message);
    res.status(500).json({ error: "Erro ao salvar token" });
  }
});

export default router;
