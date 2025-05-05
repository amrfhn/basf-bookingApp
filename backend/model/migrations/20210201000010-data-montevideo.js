const seatHoodsData = require('./data/20210201000000-montevideo-hoods.json')
const fs = require('fs').promises
const startDate = '2021-01-01'
const endDate = '2021-01-01'

const options = { returning: true }

const reducerFloors = (a, c) => {
  a[c.number] = c.id
  return a
}
const reducerAreas = (a, c) => {
  a[c.floorId] = c.id
  return a
}

const reducerSeats = (a, c) => {
  a[c.areaId + '-' + c.code] = c.id
  return a
}

const reducerHoods = (a, c) => {
  a[c.name] = c.id
  return a
}

const range = (length) => Array.from({ length }, (_, i) => i + 1)

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /** * Sites ***/
    const sites = await queryInterface.bulkInsert(
      'sites',
      [{ name: 'HUB Montevideo', country: 'Uruguay', city: 'Montevideo', startDate }],
      options
    )

    /** * Buildings ***/
    const buildings = await queryInterface.bulkInsert(
      'buildings',
      [
        {
          name: 'WTC Torre 4',
          address: 'Dr. Luis Bonavita 1266',
          reservationDays: 14,
          managerReservationDays: 30,
          cancellationHours: 1,
          reservationCancelationDays: 1,
          siteId: sites[0].id,
          startDate,
          timeDifference: -5,
        },
      ],
      options
    )

    /** * Floors ***/
    const floors = await queryInterface.bulkInsert(
      'floors',
      [18, 19, 20, 21, 22, 23, 24, 25].map((number) => {
        return { number, map: '', buildingId: buildings[0].id, startDate }
      }),
      options
    )
    const floorsIdx = floors.reduce(reducerFloors, {})

    /* Areas */
    const areas = await queryInterface.bulkInsert(
      'areas',
      [18, 19, 20, 21, 22, 23, 24, 25].map((n) => {
        return { code: '-', map: '', floorId: floorsIdx[n + ''], startDate }
      }),
      options
    )
    const areasIdx = areas.reduce(reducerAreas, {})

    /** * Seats ***/
    const seats = await queryInterface.bulkInsert(
      'seats',
      [
        [18, 69],
        [19, 63],
        [20, 89],
        [21, 85],
        [22, 81],
        [23, 77],
        [24, 64],
        [25, 82],
      ].flatMap(([f, l]) =>
        range(l).map((code) => {
          return { code, areaId: areasIdx[floorsIdx[f + '']], startDate, endDate }
        })
      ),
      options
    )
    const seatsIdx = seats.reduce(reducerSeats, {})

    /** * Enable seats ***/
    const toEnable1 = {
      18: [2, 6, 10, 14, 18, 29, 46, 52, 58, 64],
      19: [2, 16, 22, 31, 32, 42, 48, 50, 56, 60],
      20: [5, 13, 23, 29, 35, 41, 68, 74, 80, 86],
      21: [1, 9, 17, 23, 29, 34, 39, 68, 73, 79],
      22: [1, 9, 13, 28, 34, 40, 55, 61, 67, 78],
      23: [5, 13, 19, 24, 29, 49, 55, 61, 67, 73],
      24: [42, 44, 45, 46, 47, 49],
      25: [5, 13, 25, 31, 40, 46, 56, 62, 74],
    }

    const toEnable2 = {
      18: [3, 7, 11, 15, 19, 21, 23, 27, 35, 39, 42, 48, 54, 60],
      19: [9, 13, 19, 25, 26, 36, 38, 44, 55],
      20: [1, 9, 19, 21, 27, 33, 39, 47, 53, 57, 58, 62, 64, 70, 76, 78, 84],
      21: [5, 13, 21, 27, 35, 37, 46, 50, 54, 58, 59, 61, 69, 75, 83],
      22: [5, 18, 22, 26, 32, 38, 44, 48, 57, 63, 69, 73, 75],
      23: [1, 9, 17, 27, 31, 36, 40, 44, 45, 51, 57, 63, 72],
      24: [1, 5, 9, 13, 37, 53, 55, 59, 62],
      25: [1, 9, 17, 23, 29, 38, 44, 50, 54, 58, 64, 76],
    }

    const values1 = Object.entries(toEnable1)
      .map(([k, v]) => '(' + k + ', ' + v.join('), (' + k + ', ') + ')')
      .join(',\n')

    const values2 = Object.entries(toEnable2)
      .map(([k, v]) => '(' + k + ', ' + v.join('), (' + k + ', ') + ')')
      .join(',\n')

    await queryInterface.sequelize.query(
      'UPDATE seats s SET "endDate" = null WHERE EXISTS ( SELECT * FROM ( VALUES ' +
        values1 +
        ',\n' +
        values2 +
        ' )  AS enables (floor_number, seat_code), areas a INNER JOIN floors f ON f.id = a."floorId" INNER JOIN buildings b ON b.id = f."buildingId" ' +
        ' WHERE s.code = seat_code AND f.number=floor_number AND s."areaId"=a.id AND b."name"=\'WTC Torre 4\'  );'
    )

    /** *  Maps ***/
    const svg = {
      18: await fs.readFile('./model/migrations/maps/uy/wtc/18.svg', 'utf8'),
      19: await fs.readFile('./model/migrations/maps/uy/wtc/19.svg', 'utf8'),
      20: await fs.readFile('./model/migrations/maps/uy/wtc/20.svg', 'utf8'),
      21: await fs.readFile('./model/migrations/maps/uy/wtc/21.svg', 'utf8'),
      22: await fs.readFile('./model/migrations/maps/uy/wtc/22.svg', 'utf8'),
      23: await fs.readFile('./model/migrations/maps/uy/wtc/23.svg', 'utf8'),
      24: await fs.readFile('./model/migrations/maps/uy/wtc/24.svg', 'utf8'),
      25: await fs.readFile('./model/migrations/maps/uy/wtc/25.svg', 'utf8'),
    }

    await Promise.all(
      Object.entries(svg).map(([f, m]) => {
        const mFixed = m.replace(/'/g, "''")
        const query = `UPDATE areas SET map = '${mFixed}' WHERE "floorId" IN ( SELECT f.id FROM floors AS f INNER JOIN buildings AS b ON b.id = f."buildingId" WHERE b.name = 'WTC Torre 4' AND f."number" = ${f});`
        return queryInterface.sequelize.query(query).catch((e) => console.error(f, e))
      })
    )

    /** *  Hoods ***/
    const hoodsRaw = [
      'Communications',
      'GTU',
      'Financial Reporting US & CA',
      'Financial Reporting SA',
      'Financial Reporting',
      'Financial Reporting NA',
      'Business Reporting Technoledge',
      'Business Reporting TeamD',
      'Business Reporting TeamC',
      'Business Reporting TeamB',
      'Business Reporting TeamA',
      'Business Reporting',
      'Business Reporting BI&Data Enablement',
      'Business Reporting Experts',
      'Business Reporting RPA',
      'Controlling - CC',
      'Controlling - CB',
      'Controlling - C',
      'Controlling',
      'Product Safety Services',
      'Environmental,Health & Safety',
      'EHSQ',
      'EHS Reporting',
      'General Management',
      'People Services US & CA',
      'Experts People Services',
      'Talent Acquisition People Services',
      'People Services MX, CC & CA',
      'Human Resources',
      'Legal Contracting Center',
      'Treasury',
      'Process Optimization & Knowledge',
      'Master Data',
      'Cash Management',
      'Intercompany&Invoicing',
      'Collection US & Canada',
      'AR US & Canada',
      'AR South & Central America + MX',
      'AR Brazil',
      'AR & Collection & Intercompany',
      'Order to Cash',
      'Travel & Expenses',
      'P2P Transition',
      'NA Indirect',
      'Procurement SA',
      'Direct Procurement Americas',
      'Freights',
      'Facility Management',
      'P2P Experts & Knowledge Coordination',
      'AP US & Canada 3',
      'AP US & Canada 1',
      'AP Latam',
      'AP Brazil',
      'P2P Transition2',
      'P2P Process and Systems',
      'Projects',
      'Export Management',
      'Import Management',
      'Samples Management',
      'Supply Chain',
      'GD RPA Global',
      'GD RBPS SA',
      'GD Management Accounting',
      'GD Financial Accounting and Reporting',
    ]

    const hoods = await queryInterface.bulkInsert(
      'hoods',
      hoodsRaw.map((name) => {
        return { name }
      }),
      options
    )
    const hoodIdx = hoods.reduce(reducerHoods, {})

    /** *  Hoods - OrgCodes ***/
    const hoodOrgCodesRaw = {
      GTU: 'GB/CD',
      Communications: 'GB/H',
      'Financial Reporting US & CA': 'GBW/SF-F2',
      'Financial Reporting SA': 'GBW/SF-F1',
      'Financial Reporting': 'GBW/SF-F',
      'Financial Reporting NA': 'GBW/SF-F3',
      'Business Reporting Technoledge': 'GBW/SF-BT',
      'Business Reporting TeamD': 'GBW/SF-BSD',
      'Business Reporting TeamC': 'GBW/SF-BSC',
      'Business Reporting TeamB': 'GBW/SF-BSB',
      'Business Reporting TeamA': 'GBW/SF-BSA',
      'Business Reporting': 'GBW/SF-B',
      'Business Reporting BI&Data Enablement': 'GBW/SF-BTB',
      'Business Reporting Experts': 'GBW/SF-BTE',
      'Business Reporting RPA': 'GBW/SF-BTR',
      'Controlling - CC': 'GB/CC',
      'Controlling - CB': 'GB/CB',
      'Controlling - C': 'GB/C',
      Controlling: 'GB/CR',
      'Product Safety Services': 'GBP/SR',
      'Environmental,Health & Safety': 'GBP/S',
      EHSQ: 'GBP/SE',
      'EHS Reporting': 'GBP/SO',
      'General Management': 'GBW/S',
      'People Services US & CA': 'GBW/SHV',
      'Experts People Services': 'GBW/SHV-1',
      'Talent Acquisition People Services': 'GBW/SHV-2',
      'People Services MX, CC & CA': 'GBW/SHV-3',
      'Human Resources': 'GB/H',
      'Legal Contracting Center': 'GBW/SF-F4',
      Treasury: 'GBW/SO-CT',
      'Process Optimization & Knowledge': 'GBW/SO-CE',
      'Master Data': 'GBW/SO-CM',
      'Cash Management': 'GBW/SO-CC',
      'Intercompany&Invoicing': 'GBW/SO-CR2',
      'Collection US & Canada': 'GBW/SO-CR5',
      'AR US & Canada': 'GBW/SO-CR3',
      'AR South & Central America + MX': 'GBW/SO-CR4',
      'AR Brazil': 'GBW/SO-CR1',
      'AR & Collection & Intercompany': 'GBW/SO-CR',
      'Order to Cash': 'GBW/SO-C',
      'Travel & Expenses': 'GBW/SL-FPT',
      'P2P Transition': 'GBW/SL',
      'NA Indirect': 'GBW/SL-MP3',
      'Procurement SA': 'GBW/SL-MP1',
      'Direct Procurement Americas': 'GBW/SL-MP2',
      Freights: 'GBW/SL-FPF',
      'Facility Management': 'GBW/SY',
      'P2P Experts & Knowledge Coordination': 'GBW/SL-ME',
      'AP US & Canada 3': 'GBW/SL-FPA5',
      'AP US & Canada 1': 'GBW/SL-FPA1',
      'AP Latam': 'GBW/SL-FPA3',
      'AP Brazil': 'GBW/SL-FPA4',
      'P2P Transition2': 'GBW/SL1',
      'P2P Process and Systems': 'GBW/SL-ME1',
      Projects: 'GB/CP',
      'Export Management': 'GBC/GX-EM',
      'Import Management': 'GBC/GX-IM',
      'Samples Management': 'GBW/SU-SM',
      'Supply Chain': 'GBW/SU',
      'GD RPA Global': 'GDE/KA',
      'GD RBPS SA': 'GDA/BE',
      'GD Management Accounting': 'GDE/DC',
      'GD Financial Accounting and Reporting': 'GDE/DA',
    }
    const hoodOrgCodes = await queryInterface.bulkInsert(
      'hoodOrgCodes',
      Object.entries(hoodOrgCodesRaw).map(([k, orgCode]) => {
        return { hoodId: hoodIdx[k], orgCode }
      }),
      options
    )

    /** *  Hoods - Seat ***/
    const seatHoodsData = require('./data/20210201000000-montevideo-hoods.json')

    const seatHoods = await queryInterface.bulkInsert(
      'seatHoods',
      Object.entries(seatHoodsData).flatMap(([h, v]) => {
        return Object.entries(v).flatMap(([f, a]) => {
          return a.map((s) => {
            const hoodId = hoodIdx[h]
            const floorId = floorsIdx[f]
            const areaId = areasIdx[floorId]
            const seatId = seatsIdx[areaId + '-' + s]

            return { hoodId, seatId }
          })
        })
      }),
      options
    )
  },
  down: async (queryInterface, Sequelize) => {},
}
