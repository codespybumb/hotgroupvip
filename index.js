require('dotenv').config()

// ⚠️ IMPORTANTE
// index.js NÃO pode iniciar servidor nem usar Prisma direto
// ele só orquestra os módulos

require('./server')

// bot e cron só se estiver habilitado (Railway-safe)
if (process.env.ENABLE_BOT === 'true') {
  require('./bot')
}

if (process.env.ENABLE_CRON === 'true') {
  require('./cron')
}
