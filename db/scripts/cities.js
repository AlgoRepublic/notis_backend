const cities = require('../files/cities.json')
const { logError } = require('../../utils/log')

const seedCities = async (connection) => {
  const Country = connection.model('Country')
  const State = connection.model('State')
  const City = connection.model('City')

  for (const c of cities) {
    try {
      const country = await Country.findOne({ id: c.country_id })
      const state = await State.findOne({ id: c.state_id })
      const city = await City.findOneAndUpdate(
        { id: c.id },
        {
          id: c.id,
          name: c.name,
          country: country._id,
          state: state._id,
        },
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
          runValidators: true,
        }
      )

      await Country.findOneAndUpdate(
        { id: country.id },
        {
          $addToSet: { states: state._id, cities: city._id },
        }
      )

      await State.findOneAndUpdate(
        { id: state.id },
        {
          $addToSet: { cities: city._id },
        }
      )
    } catch (error) {
      logError(error)
    }
  }
}

module.exports = seedCities
