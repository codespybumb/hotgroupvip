import TelegramBot from 'node-telegram-bot-api'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const token = process.env.BOT_TOKEN
if (!token) {
  throw new Error('BOT_TOKEN não definido')
}

const bot = new TelegramBot(token, { polling: true })

console.log('🤖 Bot iniciado')

// TESTE SIMPLES: salva qualquer mensagem no banco
bot.on('message', async (msg) => {
  if (!msg.from) return

  const telegramId = BigInt(msg.from.id)

  try {
    await prisma.vipUser.upsert({
      where: { telegramId },
      update: {},
      create: {
        telegramId,
        username: msg.from.username
      }
    })

    bot.sendMessage(
      msg.chat.id,
      '✅ Mensagem recebida e usuário salvo no banco!'
    )

  } catch (err) {
    console.error('Erro ao salvar usuário:', err)
    bot.sendMessage(msg.chat.id, '❌ Erro ao salvar no banco')
  }
})
