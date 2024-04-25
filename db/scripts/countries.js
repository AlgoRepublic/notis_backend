const countries = require('../files/countries.json')
const { logError } = require('../../utils/log')

const seedCountries = async (connection) => {
  const Country = connection.model('Country')

  for (const country of countries) {
    try {
      await Country.findOneAndUpdate(
        { id: country.id },
        {
          id: country.id,
          name: country.name,
          iso2: country.iso2,
          iso3: country.iso3,
        },
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
          runValidators: true,
        }
      )
    } catch (error) {
      logError(error)
    }
  }
}

module.exports = seedCountries
