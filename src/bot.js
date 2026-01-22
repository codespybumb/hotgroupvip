import TelegramBot from 'node-telegram-bot-api'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const token = process.env.BOT_TOKEN
if (!token) throw new Error('BOT_TOKEN não definido')

const bot = new TelegramBot(token, { polling: true })

console.log('🤖 Bot iniciado')

/* =========================
   /start
========================= */
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id
  const user = msg.from

  // salva silenciosamente
  try {
    await prisma.vipUser.upsert({
      where: { telegramId: BigInt(user.id) },
      update: {
        username: user.username ?? null
      },
      create: {
        telegramId: BigInt(user.id),
        username: user.username ?? null
      }
    })
  } catch (err) {
    console.error('Erro ao salvar usuário:', err)
  }

  bot.sendMessage(
    chatId,
    `👋 Olá, ${user.first_name}!

Bem-vindo ao *Bot VIP* 🔥

Aqui você pode:
✅ Ativar seu acesso VIP  
✅ Receber conteúdos exclusivos  

👉 Para continuar, use o comando:
/vip`,
    { parse_mode: 'Markdown' }
  )
})

/* =========================
   /vip
========================= */
bot.onText(/\/vip/, async (msg) => {
  const chatId = msg.chat.id
  const user = msg.from

  try {
    await prisma.vipUser.upsert({
      where: { telegramId: BigInt(user.id) },
      update: {
        isActive: true
      },
      create: {
        telegramId: BigInt(user.id),
        username: user.username ?? null,
        isActive: true
      }
    })

    bot.sendMessage(
      chatId,
      `✅ *Acesso VIP confirmado!*

Seu cadastro está ativo 🚀  
Em breve você receberá o acesso ao grupo VIP.

Fique atento 😉`,
      { parse_mode: 'Markdown' }
    )
  } catch (err) {
    console.error('Erro ao ativar VIP:', err)

    bot.sendMessage(
      chatId,
      '❌ Ocorreu um erro ao ativar seu acesso. Tente novamente.'
    )
  }
})
