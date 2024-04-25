const states = require('../files/states.json')
const { logError } = require('../../utils/log')

const seedStates = async (connection) => {
  const Country = connection.model('Country')
  const State = connection.model('State')

  for (const s of states) {
    try {
      const country = await Country.findOne({ id: s.country_id })
      const state = await State.findOneAndUpdate(
        { id: s.id },
        {
          id: s.id,
          name: s.name,
          code: s.state_code,
          country: country._id,
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
          $addToSet: { states: state._id },
        }
      )
    } catch (error) {
      logError(error)
    }
  }
}

module.exports = seedStates
