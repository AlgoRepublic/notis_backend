const cron = require('../utils/cron')
const scrapingSyncService = require('../services/scraping/sync')

cron.schedule('*/15 * * * *', scrapingSyncService)
