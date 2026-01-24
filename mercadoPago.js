const axios = require('axios')

async function criarAssinatura(telegramId, email) {
  const response = await axios.post(
    'https://api.mercadopago.com/preapproval',
    {
      reason: 'Grupo VIP Telegram',
      external_reference: telegramId,
      payer_email: email,
      auto_recurring: {
        frequency: 1,
        frequency_type: 'months',
        transaction_amount: 29.9,
        currency_id: 'BRL'
      },
      back_url: 'https://hotgroupvip-production.up.railway.app/ml/callback'
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`
      }
    }
  )

  return response.data.init_point
}

module.exports = { criarAssinatura }
