const lang = {
  en: require('../i18n/en.json'),
  de: require('../i18n/de.json'),
  es: require('../i18n/es.json'),
  pt: require('../i18n/pt.json')
}

export default ({ app }, inject) => {
  inject('dk', key => getValue(key, getLang(app.i18n)))
}

function getLang (i18n) {
  return lang[i18n.locale] || lang.en
}

function getValue (key, lang) {
  const path = key.split('.')
  let result = lang
  for (const p of path) {
    result = result[p]
    if (!result) { break }
  }
  return result || key
}
