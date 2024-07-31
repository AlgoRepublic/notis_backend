require('../utils/dotenv')
const elasticsearch = require('./scripts/elasticsearch')

const {
  connectAllDb,
  getAdminConnection,
  getConnectionBySubdomain,
} = require('../utils/connection-manager')
const { logInfo, logError } = require('../utils/log')

const seedAllData = async () => {
  const subDomains = await getAdminConnection()
    .model('SubDomain')
    .find({})
    .lean()
    .exec()

  for (const subdomain of subDomains) {
    const connection = await getConnectionBySubdomain(subdomain.host)

    logInfo(
      `Deleted Jobs from ${subdomain._id}`,
      await connection.model('Job').deleteMany({})
    )
    logInfo(
      `Deleted Rentals from ${subdomain._id}`,
      await connection.model('Rental').deleteMany({})
    )
    logInfo(
      `Deleted Searchs from ${subdomain._id}`,
      await connection.model('Search').deleteMany({})
    )
    logInfo(
      `Deleted Alerts from ${subdomain._id}`,
      await connection.model('Alert').deleteMany({})
    )
    logInfo(
      `Deleted Devices from ${subdomain._id}`,
      await connection.model('Device').deleteMany({})
    )
  }
}

connectAllDb().then(async () => {
  logInfo(`Seeding process started in ${process.env.NODE_ENV} environment`)

  try {
    await seedAllData()

    logInfo(
      `Seeding process finished successfully in ${process.env.NODE_ENV} environment`
    )
    process.exit(0)
  } catch (error) {
    logError(`Error in seeding process: ${error}`)
    process.exit(1)
  }
})
