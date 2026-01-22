import express from 'express'
import './src/bot.js'

console.log('ENV BOT_TOKEN =', process.env.BOT_TOKEN)

const app = express()
const PORT = process.env.PORT || 8080

app.get('/', (req, res) => {
  res.send('Bot VIP rodando 🚀')
})

app.listen(PORT, () => {
  console.log(`Server rodando na porta ${PORT}`)
})
