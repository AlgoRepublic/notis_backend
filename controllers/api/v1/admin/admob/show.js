const Joi = require('joi')
const { CustomError } = require('../../../../../utils/error')
const { joiValidate, joiError } = require('../../../../../utils/joi')
const { successResponse } = require('../../../../../utils/response')
const { aysncMiddleware } = require('../../../../../middlewares/async')

const show = aysncMiddleware(async (req, res, next) => {
    const connection = req.dbConnection

    const { _id } = req.params

    const schema = Joi.object({
        _id: Joi.string().hex().length(24).required(),
    })

    const { error } = await joiValidate(schema, {
        _id,
    })

    if (error) {
        throw new CustomError(joiError(error))
    }

    const admob = await connection
        .model('Admob')
        .findOne({
            _id,
        })
        .select({
            admobType: 1,
            detail: 1,
        })
        .lean()
        .exec()

    return successResponse(res, 'Admob info', {
        admob,
    })
})

module.exports = show
