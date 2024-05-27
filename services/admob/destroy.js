const Joi = require('joi')
const { CustomError } = require('../../utils/error')
const { joiValidate, joiError } = require('../../utils/joi')

const destroy = async (dbConnection, params) => {
    params = params || {}

    try {
        const { _id } = params

        const schema = Joi.object({
            _id: Joi.string().hex().length(24).required(),
        })

        const { error } = await joiValidate(schema, { _id })

        if (error) {
            throw new CustomError(joiError(error))
        }

        const admob = await dbConnection.model('Admob').findOne({ _id }).exec()

        if (!admob) {
            throw new CustomError('Admob not found')
        }

        await admob.deleteOne()

        return true
    } catch (error) {
        throw new CustomError(error?.message)
    }
}

module.exports = destroy
