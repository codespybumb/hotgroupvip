import express from 'express'
import './src/bot.js' // 👈 ISSO INICIA O BOT

const app = express()

const PORT = process.env.PORT || 8080

app.get('/', (req, res) => {
  res.send('Bot VIP rodando 🚀')
})

app.listen(PORT, () => {
  console.log(`Server rodando na porta ${PORT}`)
})
