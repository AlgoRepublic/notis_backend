const { successResponse } = require('../../../../../utils/response')
const { aysncMiddleware } = require('../../../../../middlewares/async')
const { pagyParams, pagyRes } = require('../../../../../utils/pagination')
const { logError } = require('../../../../../utils/log')

const list = aysncMiddleware(async (req, res, next) => {
  const connection = req.sdbConnection
  const { page, perPage } = pagyParams(req.query.page, req.query.perPage)
  const { title, location } = req.query

  let jobs
  try {
    const esJobs = await connection.model('Job').esSearch(
      {
        size: perPage,
        from: (page - 1) * perPage,
        sort: [{ createdAt: 'desc' }],
        query: {
          bool: {
            must: [
              ...(title
                ? [
                    {
                      bool: {
                        should: [
                          {
                            multi_match: {
                              query: title,
                              fields: ['title', 'description', 'entity'],
                            },
                          },
                          {
                            bool: {
                              should: [
                                { wildcard: { title: `*${title}*` } },
                                { wildcard: { description: `*${title}*` } },
                                { wildcard: { entity: `*${title}*` } },
                              ],
                            },
                          },
                        ],
                      },
                    },
                  ]
                : []),
              ...(location
                ? [
                    {
                      bool: {
                        should: [
                          {
                            match: {
                              location: 'location',
                            },
                          },
                          {
                            wildcard: { location: `*${location}*` },
                          },
                        ],
                      },
                    },
                  ]
                : []),
            ],
          },
        },
      },
      { index: `jobs-${req.subDomainId}` }
    )

    jobs = esJobs.body.hits.hits.map((job) => {
      return {
        id: job._id,
        title: job._source.title,
        description: job._source.description,
        entity: job._source.entity,
        location: job._source.location,
        url: job._source.url,
        createdAt: job._source.createdAt,
      }
    })

    jobs = pagyRes(jobs, esJobs.body.hits.total, page, perPage)
  } catch (error) {
    logError(error)
    jobs = pagyRes([], 0, page, perPage)
  }

  return successResponse(res, 'Job List', { jobs })
})

module.exports = list
