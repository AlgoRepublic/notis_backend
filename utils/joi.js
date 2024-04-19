const options = {
  errors: {
    wrap: {
      label: false,
    },
  },
}

const joiValidate = async (schema, property) => {
  return await schema.validate(property, options)
}

const joiCustomErrors = (error) => {
  const errors = error.details.map((err) => {
    return err.message
  })

  return errors
}

const joiError = (error) => {
  return error.details[0].message
}

module.exports = {
  joiValidate,
  joiCustomErrors,
  joiError,
}
