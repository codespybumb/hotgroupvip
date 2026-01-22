const cron = require('node-cron')

cron.schedule('0 3 * * *', () => {
  console.log('🔄 Verificação diária de assinaturas')
})
