const { successResponse } = require('../../../../../utils/response')
const { aysncMiddleware } = require('../../../../../middlewares/async')
const { pagyParams, pagyRes } = require('../../../../../utils/pagination')
const { logError } = require('../../../../../utils/log')

const list = aysncMiddleware(async (req, res, next) => {
  const connection = req.sdbConnection
  const { page, perPage } = pagyParams(req.query.page, req.query.perPage)
  const { title, location } = req.query

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
                      bool: {
                        should: [
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
                            },
                          },
                          {
                            bool: {
                              should: [
                                { wildcard: { title: `*${title}*` } },
                                { wildcard: { description: `*${title}*` } },
                                { wildcard: { entity: `*${title}*` } },
                                { wildcard: { summary: `*${title}*` } },
                                { wildcard: { price: `*${title}*` } },
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
      { index: `rentals-${req.subDomainId}` }
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
        thumbnails: rental._source.thumbnails,
        createdAt: rental._source.createdAt,
      }
    })

    rentals = pagyRes(rentals, esRentals.body.hits.total, page, perPage)
  } catch (error) {
    logError(error)
    rentals = pagyRes([], 0, page, perPage)
  }

  return successResponse(res, 'Rental List', { rentals })
})

module.exports = list
