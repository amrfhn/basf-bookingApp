const data = [
  'airaudv',
  'bazma',
  'codesajc',
  'dealmed1',
  'duterj',
  'faleroe',
  'fontese',
  'garcjp',
  'mandlc',
  'marizcl',
  'meiklen',
  'mellot',
  'mendezf5',
  'mihuras',
  'mullingo',
  'ojedam1',
  'pineyrf',
  'pinin',
  'rabinoal',
  'richardi',
  'rivasj2',
  'rodril24',
  'rodrim86',
  'rollangj',
  'rovelljm',
  'sobredj',
  'sorianlu',
  'targinr',
  'taveirp',
  'tebotma',
  'tejerav',
  'trejosc',
  'vazv',
  'veraa6',
]

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'brigadiers',
      data.map((username) => {
        return { username }
      })
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('brigadiers', { username: data })
  },
}
