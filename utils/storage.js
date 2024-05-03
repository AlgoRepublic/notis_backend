const Joi = require('joi')
const mime = require('mime-types')
const mongoose = require('mongoose')
const { CustomError } = require('./error')
const { joiValidate, joiError } = require('./joi')

const saveFile = async (file, dir = '') => {
  const schema = Joi.object({
    file: Joi.object({
      data: Joi.binary().required(),
    })
      .unknown()
      .required(),
  })

  const { error } = await joiValidate(schema, { file })

  if (error) {
    throw new CustomError(joiError(error))
  }

  const filePath =
    'storage/' +
    dir +
    '/' +
    new mongoose.Types.ObjectId() +
    '.' +
    mime.extension(file.mimetype)

  await file.mv(global.__basedir + '/' + filePath)

  return filePath
}

module.exports = {
  saveFile,
}
