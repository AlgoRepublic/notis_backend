const { successResponse } = require('../../../../../utils/response')
const { aysncMiddleware } = require('../../../../../middlewares/async')
const { pagyParams, pagyRes } = require('../../../../../utils/pagination')

const list = aysncMiddleware(async (req, res, next) => {
  const connection = req.dbConnection
  const { page, perPage } = pagyParams(req.query.page, req.query.perPage)
  const {
    title,
    domainName,
    host,
    fqdn,
    type,
    answer,
    ttl,
    status,
    searchEngineURLs,
    appType,
    country,
    sort,
    sortAs,
  } = req.query
  const query = {}
  const sortQuery = {}

  if (domainName) {
    query.domainName = { $regex: domainName, $options: 'i' }
  }

  if (host) {
    query.host = { $regex: host, $options: 'i' }
  }

  if (fqdn) {
    query.fqdn = { $regex: fqdn, $options: 'i' }
  }

  if (type) {
    query.type = { $regex: type, $options: 'i' }
  }

  if (answer) {
    query.answer = { $regex: answer, $options: 'i' }
  }

  if (ttl) {
    query.ttl = ttl
  }

  if (title) {
    query['app.title'] = { $regex: title, $options: 'i' }
  }

  if (status !== undefined) {
    query.status = status
  }

  if (searchEngineURLs) {
    query.searchEngineURLs = searchEngineURLs
  }

  if (appType) {
    query['app.appType'] = appType
  }

  if (country) {
    query['app.country.name'] = country
  }

  if (
    sort &&
    sortAs &&
    ['asc', 'desc'].includes(sortAs) &&
    [
      'title',
      'domainName',
      'host',
      'fqdn',
      'type',
      'answer',
      'ttl',
      'status',
      'searchEngineURLs',
      'appType',
      'country',
    ].includes(sort)
  ) {
    let sortKey = sort
    if (sort === 'title') {
      sortKey = 'app.title'
    } else if (sort === 'country') {
      sortKey = 'app.country.name'
    } else if (sort === 'appType') {
      sortKey = 'app.appType'
    }

    sortQuery[sortKey] = sortAs === 'asc' ? 1 : -1
  } else {
    sortQuery._id = -1
  }

  const subDomainCommonAgg = [
    {
      $lookup: {
        from: 'apps',
        localField: 'app',
        foreignField: '_id',
        as: 'app',
        pipeline: [
          {
            $lookup: {
              from: 'countries',
              localField: 'country',
              foreignField: '_id',
              as: 'country',
            },
          },
          {
            $unwind: {
              path: '$country',
              preserveNullAndEmptyArrays: true,
            },
          },
        ],
      },
    },
    {
      $unwind: {
        path: '$app',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $match: query,
    },
  ]

  const subDomains = await connection.model('SubDomain').aggregate([
    ...subDomainCommonAgg,
    {
      $sort: sortQuery,
    },
    {
      $skip: (page - 1) * perPage,
    },
    {
      $limit: perPage,
    },
    {
      $project: {
        recordId: 1,
        domainName: 1,
        host: 1,
        fqdn: 1,
        type: 1,
        answer: 1,
        ttl: 1,
        subDomainURL: 1,
        searchEngineURLs: 1,
        status: 1,
        app: {
          _id: 1,
          title: 1,
          description: 1,
          appType: 1,
          country: {
            _id: 1,
            name: 1,
          },
        },
      },
    },
  ])

  const count = (
    await connection
      .model('SubDomain')
      .aggregate([
        ...subDomainCommonAgg,
        { $group: { _id: null, count: { $sum: 1 } } },
      ])
  )[0]?.count

  const pagySubDomains = pagyRes(subDomains, count, page, perPage)

  return successResponse(res, req.t('29'), { subDomains: pagySubDomains })
})

module.exports = list
