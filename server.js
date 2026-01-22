const express = require('express')
const webhook = require('./webhook')

const app = express()
app.use(express.json())

app.post('/webhook', webhook)

app.listen(process.env.PORT, () => {
  console.log(`Servidor rodando na porta ${process.env.PORT}`)
})
