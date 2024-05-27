const createAdmobService = require('../../../../../services/admob/create')
const { successResponse } = require('../../../../../utils/response')
const { aysncMiddleware } = require('../../../../../middlewares/async')

const create = aysncMiddleware(async (req, res, next) => {
    const connection = req.dbConnection

    const { admobType, detail } = req.body
    let admob = await createAdmobService(connection, {
        admobType,
        detail
    })

    admob = await connection
        .model('Admob')
        .findOne({ _id: admob._id })
        .select({
            admobType: 1,
            detail: 1,
        })
        .lean()
        .exec()

    return successResponse(res, 'Admob create successfully', {
        admob,
    })
})

module.exports = create
