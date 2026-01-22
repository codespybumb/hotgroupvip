bot.on('message', async (msg) => {
  const telegramId = BigInt(msg.from.id)
  const username = msg.from.username || null

  try {
    await prisma.user.upsert({
      where: { telegramId },
      update: {},
      create: {
        telegramId,
        username
      }
    })

    bot.sendMessage(
      msg.chat.id,
      '✅ Mensagem recebida e usuário salvo no banco!'
    )

    console.log('💾 Usuário salvo:', telegramId.toString())
  } catch (err) {
    console.error('❌ Erro ao salvar usuário:', err)
    bot.sendMessage(msg.chat.id, '❌ Erro ao salvar no banco')
  }
})
