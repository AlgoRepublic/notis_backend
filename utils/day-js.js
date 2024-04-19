const dayjs = require('dayjs')
const advancedFormat = require('dayjs/plugin/advancedFormat')
const customParseFormat = require('dayjs/plugin/customParseFormat')
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')

dayjs.extend(advancedFormat)
dayjs.extend(customParseFormat)
dayjs.extend(utc)
dayjs.extend(timezone)

module.exports = dayjs
