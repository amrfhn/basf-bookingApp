const workStreamsRAW = {
  'Business Reporting': [
    'GBW/SF-B',
    'GBW/SF-BSA',
    'GBW/SF-BSB',
    'GBW/SF-BSC',
    'GBW/SF-BSD',
    'GBW/SF-BT',
    'GBW/SF-BTB',
    'GBW/SF-BTE',
    'GBW/SF-BTR',
  ],
  'Environmental, Health & Safety': ['GBP/S', 'GBP/SE', 'GBP/SO', 'GBP/SR'],
  'Financial Reporting': ['GBW/SF-F', 'GBW/SF-F1', 'GBW/SF-F2', 'GBW/SF-F3'],
  Legal: ['GBI'],
  'Order to Cash': [
    'GBW/SO-C',
    'GBW/SO-CC',
    'GBW/SO-CE',
    'GBW/SO-CM',
    'GBW/SO-CR',
    'GBW/SO-CR1',
    'GBW/SO-CR2',
    'GBW/SO-CR3',
    'GBW/SO-CR4',
    'GBW/SO-CR5',
    'GBW/SO-CT',
  ],
  'People Services': ['GBW/SHV', 'GBW/SHV-1', 'GBW/SHV-2', 'GBW/SHV-3'],
  'Purchase to Pay': [
    'GBW/SL',
    'GBW/SL1',
    'GBW/SL-FPA1',
    'GBW/SL-FPA3',
    'GBW/SL-FPA4',
    'GBW/SL-FPA5',
    'GBW/SL-FPF',
    'GBW/SL-FPT',
    'GBW/SL-ME',
    'GBW/SL-ME1',
    'GBW/SL-MP1',
    'GBW/SL-MP2',
    'GBW/SL-MP3',
    'GBW/SY',
  ],
  'Supply Chain': ['GBC/GX-EM', 'GBC/GX-IM', 'GBW/SU', 'GBW/SU-SM'],
  'Supporting Units': [
    'GB/C',
    'GB/CB',
    'GB/CC',
    'GB/CD',
    'GB/CP',
    'GB/CR',
    'GB/H',
    'GBW/S',
    'GDA/BE',
    'GDE/DA',
    'GDE/DC',
    'GDE/KA',
  ],
}

const workStreamReducer = (a, c) => {
  a[c.name] = c.id
  return a
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()

    const siteId = (await queryInterface.sequelize.query(`SELECT id FROM sites WHERE country = 'Uruguay'`))[0][0].id

    const workStreams = await queryInterface.bulkInsert(
      'workStreams',
      Object.keys(workStreamsRAW).map((name) => {
        return { name, siteId }
      }),
      { transaction, returning: true }
    )

    const workStreamIdx = workStreams.reduce(workStreamReducer, {})

    await queryInterface.bulkInsert(
      'workStreamOrgCodes',
      Object.entries(workStreamsRAW).flatMap(([workStream, orgCodes]) => {
        const workStreamId = workStreamIdx[workStream]
        return orgCodes.map((orgCode) => {
          return { orgCode, workStreamId }
        })
      }),
      { transaction }
    )

    await transaction.commit()
  },
  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()

    const siteId = (await queryInterface.sequelize.query(`SELECT id FROM sites WHERE country = 'Uruguay'`))[0][0].id

    const workStreams = (
      await queryInterface.sequelize.query(`SELECT id, name FROM "workStreams" WHERE "siteId" = ${siteId}`)
    )[0]
    const workStreamIdx = workStreams.reduce(workStreamReducer, {})

    const valuesToDelete = Object.entries(workStreamsRAW)
      .flatMap(([workStream, orgCodes]) => {
        const workStreamId = workStreamIdx[workStream]
        return orgCodes.map((orgCode) => {
          return `(  ${workStreamId}, '${orgCode}')`
        })
      })
      .join(',\n')

    await queryInterface.sequelize.query(
      `DELETE FROM "workStreamOrgCodes" woc WHERE exists( 
             SELECT * FROM (VALUES  ${valuesToDelete} ) AS toDelete (workStreamId, orgCode),
                   "workStreamOrgCodes" wocE INNER JOIN "workStreams" w ON w.id = wocE."workStreamId"
              WHERE wocE."workStreamId" = toDelete.workStreamId
                AND wocE."orgCode" = toDelete.orgCode
                AND wocE.id = woc.id
          )`,
      { transaction }
    )

    await queryInterface.sequelize.query(
      `DELETE FROM "workStreams" woc WHERE woc.id IN (${Object.values(workStreamIdx).join(',')})`,
      { transaction }
    )

    await transaction.commit()
  },
}
