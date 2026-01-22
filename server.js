import './src/bot.js'
import express from 'express'
import mlAuth from "./src/mlAuth.js";

app.use("/ml", mlAuth);

const app = express()

app.get('/', (_, res) => {
  res.send('Bot VIP online')
})

app.listen(8080, () => {
  console.log('Server rodando na porta 8080')
})
