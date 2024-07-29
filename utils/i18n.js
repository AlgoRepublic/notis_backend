const path = require('path')
const i18n = require('i18n')
const { logError } = require('./log')

i18n.configure({
  locales: ['en', 'es'],
  directory: path.join(__dirname, '../locales'),
  defaultLocale: 'en',
  api: {
    __: 't',
  },
})

const translate = (phrase, locale = 'en') => {
  try {
    return i18n.__({ phrase, locale })
  } catch (error) {
    logError(error)
    return phrase
  }
}

module.exports = { i18n, translate }
