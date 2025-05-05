const de = require('./de.json')
const en = require('./en.json')
const es = require('./es.json')
const pt = require('./pt.json')
const kr = require('./kr.json')

const conf = {
  locales: [
    {
      code: 'en',
      name: 'English',
      iso: 'en-US',
      flag: 'us'
    },
    {
      code: 'de',
      name: 'Deutsch',
      iso: 'de-DE',
      flag: 'de'
    },
    {
      code: 'es',
      name: 'Español',
      iso: 'es-ES',
      flag: 'es'
    },
    {
      code: 'pt',
      name: 'Português',
      iso: 'pt-BR',
      flag: 'br'
    },
    {
      code: 'kr',
      name: '한국인',
      iso: 'kr-KR',
      flag: 'kr'
    }
  ],
  lazy: false,
  defaultLocale: 'en',
  vueI18n: {
    fallbackLocale: 'en',
    messages: { en, de, es, pt, kr }
  },
  parsePages: false,
  vueI18nLoader: true,
  beforeLanguageSwitch: (oldLocale, newLocale) => { console.log('Change language to', newLocale) }
}
module.exports = conf
