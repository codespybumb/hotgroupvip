import TelegramBot from 'node-telegram-bot-api'

/* =========================
   CONFIGURAÇÃO
========================= */

const token = process.env.BOT_TOKEN
const VIP_GROUP_ID = process.env.VIP_GROUP_ID

if (!token) {
  throw new Error('❌ BOT_TOKEN não encontrado')
}

if (!VIP_GROUP_ID) {
  throw new Error('❌ VIP_GROUP_ID não encontrado')
}

/* =========================
   INICIALIZAÇÃO
========================= */

const bot = new TelegramBot(token, { polling: true })

console.log('🤖 Bot Telegram iniciado')

/* =========================
   CONTROLE VIP (TEMPORÁRIO)
   ⚠️ Depois será banco
========================= */

const vipUsers = new Set()

/* =========================
   COMANDOS
========================= */

// /start
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    `👋 Bem-vindo!

Para acessar o grupo VIP:
➡️ use /vip`
  )
})

// /vip — simula pagamento aprovado
bot.onText(/\/vip/, async (msg) => {
  const userId = msg.from.id

  try {
    vipUsers.add(userId)

    const invite = await bot.createChatInviteLink(VIP_GROUP_ID, {
      member_limit: 1
    })

    await bot.sendMessage(
      msg.chat.id,
      `✅ Pagamento aprovado!

Entre no grupo VIP:
${invite.invite_link}`
    )

    console.log(`✅ Acesso VIP liberado para ${userId}`)
  } catch (err) {
    console.error('❌ Erro ao gerar convite:', err)

    bot.sendMessage(
      msg.chat.id,
      '❌ Erro ao liberar acesso. Tente novamente.'
    )
  }
})

/* =========================
   SEGURANÇA DO GRUPO
========================= */

// Sempre que alguém entra no grupo
bot.on('polling_error', (err) => {
  if (
    err.message.includes('ETELEGRAM') ||
    err.message.includes('ECONNRESET') ||
    err.message.includes('EFATAL')
  ) {
    // ignora erros comuns do polling
    return
  }

  console.error('🚨 Erro real no polling:', err)
})

