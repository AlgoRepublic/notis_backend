const path = require('path')
const i18n = require('i18n')

i18n.configure({
  locales: ['en', 'es'],
  directory: path.join(__dirname, '../locales'),
  defaultLocale: 'en',
  api: {
    __: 't',
  },
})

module.exports = i18n
