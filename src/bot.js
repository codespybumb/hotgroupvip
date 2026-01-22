import TelegramBot from 'node-telegram-bot-api'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const token = process.env.BOT_TOKEN
const VIP_GROUP_ID = Number(process.env.VIP_GROUP_ID)

if (!token || !VIP_GROUP_ID) {
  throw new Error('ENV ausente')
}

const bot = new TelegramBot(token, { polling: true })

console.log('🤖 Bot iniciado')

// /start
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, '👋 Use /vip para liberar acesso')
})

// /vip
bot.onText(/\/vip/, async (msg) => {
  const userId = msg.from.id

  await prisma.vipUser.upsert({
    where: { id: userId },
    update: {},
    create: { id: userId }
  })

  const invite = await bot.createChatInviteLink(VIP_GROUP_ID, {
    member_limit: 1
  })

  bot.sendMessage(
    msg.chat.id,
    `✅ Acesso liberado:\n${invite.invite_link}`
  )
})

// valida entrada no grupo
bot.on('new_chat_members', async (msg) => {
  for (const member of msg.new_chat_members) {
    const vip = await prisma.vipUser.findUnique({
      where: { id: member.id }
    })

    if (!vip) {
      await bot.banChatMember(VIP_GROUP_ID, member.id)
      console.log(`❌ ${member.id} removido`)
    }
  }
})
