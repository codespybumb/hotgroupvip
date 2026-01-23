import express from 'express'
import axios from 'axios'
import { PrismaClient } from '@prisma/client'

const router = express.Router()
const prisma = new PrismaClient()

// 🔹 LOGIN — REDIRECIONA PRO ML
router.get('/login', (req, res) => {
  const authUrl =
    `https://auth.mercadolivre.com.br/authorization` +
    `?response_type=code` +
    `&client_id=${process.env.ML_CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(process.env.ML_REDIRECT_URI)}`

  res.redirect(authUrl)
})

// 🔹 CALLBACK — RECEBE CODE E SALVA TOKEN
router.get('/callback', async (req, res) => {
  const { code } = req.query

  if (!code) {
    return res.status(400).send('Code não recebido')
  }

  try {
    console.log('🔁 Trocando code por token...')

    const response = await axios.post(
      'https://api.mercadolibre.com/oauth/token',
      null,
      {
        params: {
          grant_type: 'authorization_code',
          client_id: process.env.ML_CLIENT_ID,
          client_secret: process.env.ML_CLIENT_SECRET,
          code,
          redirect_uri: process.env.ML_REDIRECT_URI
        }
      }
    )

    console.log('💾 Salvando token no banco...')

    await prisma.mercadoLivreToken.create({
      data: {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
        tokenType: response.data.token_type,
        scope: response.data.scope ?? null,
        expiresAt: new Date(
          Date.now() + response.data.expires_in * 1000
        )
      }
    })

    res.send('✅ Mercado Livre conectado com sucesso')

  } catch (error) {
    console.error('❌ ERRO AO SALVAR TOKEN', {
      message: error.message,
      data: error.response?.data
    })

    res.status(500).send('Erro ao salvar token')
  }
})

export default router
