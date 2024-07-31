require('../utils/dotenv')
const createJobService = require('../services/jobs/create')
const createRentalService = require('../services/rentals/create')
const updateJobService = require('../services/jobs/update')
const updateRentalService = require('../services/rentals/update')

const {
  connectAllDb,
  getAdminConnection,
  getScrapingConnection,
  getConnectionBySubdomain,
} = require('../utils/connection-manager')
const { logInfo, logError } = require('../utils/log')

const seedAllData = async () => {
  let successCount = 0
  let errorCount = 0
  let createCount = 0
  let updateCount = 0

  for await (const url of getScrapingConnection().model('URL').find()) {
    try {
      if (url.subdomain_id && url.scrape_progress === 100) {
        const subdomain = await getAdminConnection()
          .model('SubDomain')
          .findById(url.subdomain_id)

        if (!subdomain) {
          errorCount = errorCount + 1
          logError(`Subdomain not found: ${url.subdomain_id}`)
          continue
        }

        if (!url.subdomain_type) {
          errorCount = errorCount + 1
          logError(`Subdomain type not found: ${url.subdomain_id}`)
          continue
        }

        const params = {}
        params.title = url.title
        params.description = url.summary || url.description
        params.entity = url.entity
        params.location = url.location
        params.url = url.url
        params.subDomain = subdomain.host
        params.subDomainId = subdomain._id.toString()
        params.scrapingURLId = url._id.toString()
        if (url.subdomain_type === 'job') {
          params.jobType = url.job_type
          params.workplaceType = url.type_of_workplace
          params.salary = url.salary
        }
        if (url.subdomain_type === 'rental') {
          params.propertyType = url.property_type || ''
          params.summary = url.summary
          params.price = url.price
          params.thumbnails = url.thumbnails
        }

        const subdomainConnection = await getConnectionBySubdomain(
          subdomain.host
        )

        if (!subdomainConnection) {
          errorCount = errorCount + 1
          logError(`Subdomain connection not found: ${subdomain.host}`)
          continue
        }

        try {
          if (url.subdomain_type === 'job') {
            const jobExist = await subdomainConnection
              .model('Job')
              .findOne({ scrapingURLId: params.scrapingURLId })
              .lean()
              .exec()

            if (jobExist) {
              params._id = jobExist._id.toString()

              await updateJobService(subdomainConnection, params)
              updateCount = updateCount + 1
            } else {
              await createJobService(subdomainConnection, params)
              createCount = createCount + 1
            }
          }

          if (url.subdomain_type === 'rental') {
            const rentalExist = await subdomainConnection
              .model('Rental')
              .findOne({ scrapingURLId: params.scrapingURLId })
              .lean()
              .exec()

            if (rentalExist) {
              params._id = rentalExist._id.toString()

              await updateRentalService(subdomainConnection, params)
              updateCount = updateCount + 1
            } else {
              await createRentalService(subdomainConnection, params)
              createCount = createCount + 1
            }
          }

          successCount = successCount + 1
          logInfo(`URL seeded: ${url._id}`)
        } catch (error) {
          errorCount = errorCount + 1
          logError(`Error in sync: `, params, error)
        }
      } else {
        errorCount = errorCount + 1
        logError(`Subdomain not found: ${url.subdomain_id}`)
      }
    } catch (error) {
      errorCount = errorCount + 1
      if (error.message !== 'title is not allowed to be empty') {
        logError(`Error in seeding process: ${error}`)
      }
    }
  }

  logInfo(`Total URLs seeded: ${successCount}`)
  logInfo(`Total URLs created: ${createCount}`)
  logInfo(`Total URLs updated: ${updateCount}`)
  logInfo(`Total errors: ${errorCount}`)
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
