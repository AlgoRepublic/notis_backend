const mergeObjects = (a, b) => {
  return Object.entries(b).reduce((o, [k, v]) => {
    o[k] =
      v && typeof v === 'object' && o[k] !== undefined
        ? mergeObjects((o[k] = o[k] || (Array.isArray(v) ? [] : {})), v)
        : v
    return o
  }, a)
}

module.exports = {
  mergeObjects,
}
