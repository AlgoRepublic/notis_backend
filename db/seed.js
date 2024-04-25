require('../utils/dotenv')
const seedUsers = require('./scripts/users')
const seedCountries = require('./scripts/countries')
const seedStates = require('./scripts/states')
const seedCities = require('./scripts/cities')

const {
  connectAllDb,
  getAdminConnection,
} = require('../utils/connection-manager')
const { logInfo, logError } = require('../utils/log')

const seedAllData = async () => {
  await seedUsers(getAdminConnection())
  await seedCountries(getAdminConnection())
  await seedStates(getAdminConnection())
  await seedCities(getAdminConnection())
}

connectAllDb().then(async () => {
  logInfo(`Seeding process started in ${process.env.NODE_ENV} environment`)

  try {
    await seedAllData()
  } catch (error) {
    logError(`Error in seeding process: ${error}`)
  }

  logInfo(
    `Seeding process finished successfully in ${process.env.NODE_ENV} environment`
  )
  logInfo('Press Ctrl + C to exit!')
})
