const { successResponse } = require('../../../../../utils/response')
const { aysncMiddleware } = require('../../../../../middlewares/async')
const { pagyParams, pagyRes } = require('../../../../../utils/pagination')
const { logError } = require('../../../../../utils/log')

const list = aysncMiddleware(async (req, res, next) => {
  const connection = req.sdbConnection
  const { page, perPage } = pagyParams(req.query.page, req.query.perPage)
  const { title, location } = req.query
  let { priceFrom, priceTo, createdOnFrom, createdOnTo } = req.query
  let { propertyType } = req.query

  if (priceFrom) {
    priceFrom = parseFloat(priceFrom)
  }

  if (priceTo) {
    priceTo = parseFloat(priceTo)
  }

  if (
    (priceFrom || priceFrom === 0) &&
    (priceTo || priceTo === 0) &&
    priceFrom > priceTo
  ) {
    ;[priceFrom, priceTo] = [priceTo, priceFrom]
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

  if (propertyType) {
    propertyType = propertyType.split(',').map((i) => i.trim())
  } else {
    propertyType = []
  }

  let rentals
  try {
    const esRentals = await connection.model('Rental').esSearch(
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
                      multi_match: {
                        query: title,
                        fields: [
                          'title',
                          'description',
                          'entity',
                          'summary',
                          'price',
                        ],
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
              ...(priceFrom || priceTo
                ? [
                    {
                      range: {
                        price: {
                          gte: priceFrom,
                          lte: priceTo,
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
              ...(propertyType.length > 0
                ? [
                    {
                      bool: {
                        should: propertyType.map((i) => {
                          return {
                            term: {
                              'propertyType.keyword': {
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
      { index: connection.model('Rental').indexName(req.subDomainId) }
    )

    rentals = esRentals.body.hits.hits.map((rental) => {
      return {
        _id: rental._id,
        title: rental._source.title,
        description: rental._source.description,
        entity: rental._source.entity,
        location: rental._source.location,
        url: rental._source.url,
        summary: rental._source.summary,
        price: rental._source.price,
        propertyType: rental._source.propertyType,
        thumbnails: rental._source.thumbnails,
        createdAt: rental._source.createdAt,
        createdOn: rental._source.createdOn,
      }
    })

    rentals = pagyRes(rentals, esRentals.body.hits.total, page, perPage)
  } catch (error) {
    logError(error)
    rentals = pagyRes([], 0, page, perPage)
  }

  return successResponse(res, req.t('23'), { rentals })
})

module.exports = list
