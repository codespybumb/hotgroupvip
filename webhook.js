const axios = require('axios')
const bot = require('./bot')

module.exports = async (req, res) => {
  const { type, data } = req.body

  if (type === 'preapproval') {
    const subId = data.id

    const sub = await axios.get(
      `https://api.mercadopago.com/preapproval/${subId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`
        }
      }
    )

    const status = sub.data.status
    const telegramId = sub.data.external_reference

    if (status === 'authorized') {
      const invite = await bot.createChatInviteLink(process.env.GROUP_ID, {
        member_limit: 1
      })

      bot.sendMessage(
        telegramId,
        `✅ Pagamento aprovado!\nEntre no grupo VIP:\n${invite.invite_link}`
      )
    }

    if (status === 'cancelled') {
      await bot.banChatMember(process.env.GROUP_ID, telegramId)
      await bot.unbanChatMember(process.env.GROUP_ID, telegramId)
    }
  }

  res.sendStatus(200)
}
