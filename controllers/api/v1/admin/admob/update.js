const updateAdmobService = require('../../../../../services/admob/update')
const { successResponse } = require('../../../../../utils/response')
const { aysncMiddleware } = require('../../../../../middlewares/async')

const update = aysncMiddleware(async (req, res, next) => {
    const connection = req.dbConnection

    const { _id } = req.params
    const { admobType, detail } = req.body
    let admob = await updateAdmobService(connection, {
        _id,
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

    return successResponse(res, 'Admob updated successfully', {
        admob: {
            _id: admob._id,
            admobType: admob.admobType,
            detail: admob.detail

        },
    })
})

module.exports = update
