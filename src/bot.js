import TelegramBot from 'node-telegram-bot-api'

const token = process.env.BOT_TOKEN
console.log('TOKEN RECEBIDO:', token)

if (!token) {
  throw new Error('BOT_TOKEN não recebido pelo container')
}

const bot = new TelegramBot(token, { polling: true })

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
