import 'dotenv/config'
import TelegramBot from 'node-telegram-bot-api'

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, {
  polling: true
})

const VIP_GROUP_ID = Number(process.env.VIP_GROUP_ID)

// SIMULA um banco (depois vira Prisma)
const vipUsers = new Set()

console.log('🤖 Bot Telegram iniciado')

// Comando /start
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    '👋 Bem-vindo!\nUse /vip para acessar o grupo VIP.'
  )
})

// Comando /vip (por enquanto libera manual)
bot.onText(/\/vip/, async (msg) => {
  const userId = msg.from.id

  // SIMULA pagamento aprovado
  vipUsers.add(userId)

  const invite = await bot.createChatInviteLink(VIP_GROUP_ID, {
    member_limit: 1
  })

  bot.sendMessage(
    msg.chat.id,
    `✅ Acesso liberado!\nEntre no grupo VIP:\n${invite.invite_link}`
  )
})

// Sempre que alguém entra no grupo
bot.on('new_chat_members', async (msg) => {
  for (const member of msg.new_chat_members) {
    if (!vipUsers.has(member.id)) {
      await bot.banChatMember(VIP_GROUP_ID, member.id)
      console.log(`❌ Usuário ${member.id} removido (sem acesso)`)
    } else {
      console.log(`✅ Usuário ${member.id} autorizado`)
    }
  }
})
