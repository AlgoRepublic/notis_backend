const Joi = require('joi')
const { CustomError } = require('../../utils/error')
const { joiValidate, joiError } = require('../../utils/joi')

const create = async (dbConnection, params) => {
    params = params || {}

    try {
        const Admob = await dbConnection.model('Admob')

        const { _id, admobType, detail } = params

        const schema = Joi.object({
            _id: Joi.string().hex().length(24).required(),
            admobType: Joi.array()
                .items(Joi.string().valid('branch', 'test'))
                .optional(),
            detail: Joi.string().required().optional(),
        })

        const { error } = await joiValidate(schema, {
            _id,
            admobType,
            detail
        })

        if (error) {
            throw new CustomError(joiError(error))
        }



        const admob = await Admob.findOne({
            _id: _id,
        }).exec()
        if (admobType !== undefined) {
            admob.admobType = admobType
        }
        if (detail !== undefined) {
            admob.detail = detail
        }



        await admob.save()

        return admob
    } catch (error) {
        throw new CustomError(error?.message)
    }
}

module.exports = create
