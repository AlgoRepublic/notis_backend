const { successResponse } = require('../../../../../utils/response')
const { aysncMiddleware } = require('../../../../../middlewares/async')
const { pagyParams, pagyRes } = require('../../../../../utils/pagination')
const { logError } = require('../../../../../utils/log')

const list = aysncMiddleware(async (req, res, next) => {
  const connection = req.sdbConnection
  const { page, perPage } = pagyParams(req.query.page, req.query.perPage)
  const { title, location, jobType, workplaceType } = req.query
  let { salaryFrom, salaryTo, createdOnFrom, createdOnTo } = req.query

  if (salaryFrom) {
    salaryFrom = parseFloat(salaryFrom)
  }

  if (salaryTo) {
    salaryTo = parseFloat(salaryTo)
  }

  if (
    (salaryFrom || salaryFrom === 0) &&
    (salaryTo || salaryTo === 0) &&
    salaryFrom > salaryTo
  ) {
    ;[salaryFrom, salaryTo] = [salaryTo, salaryFrom]
  }

  if (createdOnFrom) {
    createdOnFrom = new Date(createdOnFrom)
  }

  if (createdOnTo) {
    createdOnTo = new Date(createdOnTo)
  }

  if (createdOnFrom && createdOnTo && createdOnFrom > createdOnTo) {
    ;[createdOnFrom, createdOnTo] = [createdOnTo, createdOnFrom]
  }

  let jobs
  try {
    const esJobs = await connection.model('Job').esSearch(
      {
        size: perPage,
        from: (page - 1) * perPage,
        sort: [{ createdOn: 'desc' }],
        query: {
          bool: {
            must: [
              ...(title
                ? [
                    {
                      multi_match: {
                        query: title,
                        fields: ['title', 'description', 'entity'],
                        fuzziness: 'auto',
                      },
                    },
                  ]
                : []),
              ...(location
                ? [
                    {
                      match: {
                        location: {
                          query: location,
                          fuzziness: 'auto',
                        },
                      },
                    },
                  ]
                : []),
              ...(salaryFrom || salaryTo
                ? [
                    {
                      range: {
                        salary: {
                          ...(salaryFrom ? { gte: salaryFrom } : {}),
                          ...(salaryTo ? { lte: salaryTo } : {}),
                        },
                      },
                    },
                  ]
                : []),
              ...(jobType ? [{ term: { jobType } }] : []),
              ...(workplaceType ? [{ term: { workplaceType } }] : []),
              ...(createdOnFrom || createdOnTo
                ? [
                    {
                      range: {
                        createdOn: {
                          ...(createdOnFrom ? { gte: createdOnFrom } : {}),
                          ...(createdOnTo ? { lte: createdOnTo } : {}),
                        },
                      },
                    },
                  ]
                : []),
            ],
          },
        },
      },
      { index: connection.model('Job').indexName(req.subDomainId) }
    )

    jobs = esJobs.body.hits.hits.map((job) => {
      return {
        id: job._id,
        title: job._source.title,
        description: job._source.description,
        entity: job._source.entity,
        location: job._source.location,
        url: job._source.url,
        jobType: job._source.jobType,
        workplaceType: job._source.workplaceType,
        salary: job._source.salary,
        createdAt: job._source.createdAt,
        createdOn: job._source.createdOn,
        scrapingURLId: job._source.scrapingURLId,
      }
    })

    jobs = pagyRes(jobs, esJobs.body.hits.total, page, perPage)
  } catch (error) {
    logError(error)
    jobs = pagyRes([], 0, page, perPage)
  }

  return successResponse(res, req.t('17'), { jobs })
})

module.exports = list
