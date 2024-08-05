const { successResponse } = require('../../../../../utils/response')
const { aysncMiddleware } = require('../../../../../middlewares/async')
const { pagyParams, pagyRes } = require('../../../../../utils/pagination')
const { logError } = require('../../../../../utils/log')

const list = aysncMiddleware(async (req, res, next) => {
  const connection = req.sdbConnection
  const { page, perPage } = pagyParams(req.query.page, req.query.perPage)
  const { title, location } = req.query
  let { salaryFrom, salaryTo, createdOnFrom, createdOnTo } = req.query
  let { jobType, workplaceType } = req.query

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

  if (jobType) {
    jobType = jobType.split(',').map((i) => i.trim())
  } else {
    jobType = []
  }

  if (workplaceType) {
    workplaceType = workplaceType.split(',').map((i) => i.trim())
  } else {
    workplaceType = []
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
                          operator: 'and',
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
              ...(jobType.length > 0
                ? [
                    {
                      bool: {
                        should: jobType.map((i) => {
                          return {
                            term: {
                              'jobType.keyword': {
                                value: i,
                              },
                            },
                          }
                        }),
                      },
                    },
                  ]
                : []),
              ...(workplaceType.length > 0
                ? [
                    {
                      bool: {
                        should: workplaceType.map((i) => {
                          return {
                            term: {
                              'workplaceType.keyword': {
                                value: i,
                              },
                            },
                          }
                        }),
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
        salaryCurrencySymbol: job._source.salaryCurrencySymbol,
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
