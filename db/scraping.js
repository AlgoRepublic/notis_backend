require('../utils/dotenv')
const syncService = require('../services/scraping/sync')
const { logInfo, logError } = require('../utils/log')

syncService()
  .then(async () => {
    logInfo('Scraping sync done')
    process.exit(0)
  })
  .catch((err) => {
    logError(err)
    process.exit(1)
  })
