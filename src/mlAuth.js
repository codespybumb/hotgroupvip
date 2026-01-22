import express from "express";
import axios from "axios";

const router = express.Router();

router.get("/login", (req, res) => {
  const url = `https://auth.mercadolivre.com.br/authorization?response_type=code&client_id=${process.env.ML_CLIENT_ID}&redirect_uri=${process.env.ML_REDIRECT_URI}`;
  res.redirect(url);
});

router.get("/callback", async (req, res) => {
  const { code } = req.query;

  const response = await axios.post(
    "https://api.mercadolibre.com/oauth/token",
    null,
    {
      params: {
        grant_type: "authorization_code",
        client_id: process.env.ML_CLIENT_ID,
        client_secret: process.env.ML_CLIENT_SECRET,
        code,
        redirect_uri: process.env.ML_REDIRECT_URI,
      },
    }
  );

  res.json(response.data);
});

export default router;
