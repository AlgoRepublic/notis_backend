const { successResponse } = require('../../../../../utils/response')
const { aysncMiddleware } = require('../../../../../middlewares/async')
const { pagyParams, pagyRes } = require('../../../../../utils/pagination')

const list = aysncMiddleware(async (req, res, next) => {
    const connection = req.dbConnection
    const { page, perPage } = pagyParams(req.query.page, req.query.perPage)
    const { admobType, detail, sort, sortAs } = req.query
    const query = {}
    const sortQuery = {}



    if (admobType) {
        query.admobType = admobType
    }
    if (detail) {
        query.detail = { $regex: detail, $options: 'i' }
    }
    if (
        sort &&
        sortAs &&
        ['asc', 'desc'].includes(sortAs) &&
        ['detail', 'admobType'].includes(sort)
    ) {
        sortQuery[sort] = sortAs === 'asc' ? 1 : -1
    } else {
        sortQuery.detail = 1
    }

    const admob = await connection
        .model('Admob')
        .find(query)
        .select({ detail: 1, admobType: 1 })
        .sort(sortQuery)
        .skip((page - 1) * perPage)
        .limit(perPage)
        .lean()

    const count = await connection.model('Admob').countDocuments(query)
    const pagyAdmobs = pagyRes(admob, count, page, perPage)

    return successResponse(res, 'Admob List', { Admobs: pagyAdmobs })
})

module.exports = list
