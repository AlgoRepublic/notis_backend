const Joi = require('joi')
const { CustomError } = require('../../utils/error')
const { joiValidate, joiError } = require('../../utils/joi')

const create = async (dbConnection, params) => {
    params = params || {}

    try {
        const Admob = await dbConnection.model('Admob')

        const { admobType, detail } = params

        const schema = Joi.object({
            admobType: Joi.array()
                .items(Joi.string().valid('branch', 'test'))
                .required(),
            detail: Joi.string().required(),


        })

        const { error } = await joiValidate(schema, {
            admobType, detail
        })

        if (error) {
            throw new CustomError(joiError(error))
        }


        const admob = new Admob()
        admob.admobType = admobType
        admob.detail = detail

        await admob.save()

        return admob
    } catch (error) {
        throw new CustomError(error?.message)
    }
}

module.exports = create
