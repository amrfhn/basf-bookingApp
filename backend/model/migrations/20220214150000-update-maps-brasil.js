const { promises: fs } = require('fs')
const { getId, indexer, returning, startDate, endDate } = require('./common')
const brasilData = require('./data/20220214150000-data-brasil.json')

const floorIndexFunction = (v) => v.number
const reducerFloor = indexer(floorIndexFunction, getId)

const areaIndexFunction = (v) => v.floorId + '-' + v.code
const reducerAreas = indexer(areaIndexFunction, getId)

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const transaction = await queryInterface.sequelize.transaction()
        const options = { transaction, returning }

        const buildingId = (await queryInterface.sequelize.query(`SELECT id FROM "buildings" WHERE name = 'Rochavera'`))[0][0]
            .id

        /** * Floors ***/
        const floorMap9 = await fs.readFile('./model/migrations/maps/br/rochavera/9/areas.svg', 'utf8')
        const floorMap12 = await fs.readFile('./model/migrations/maps/br/rochavera/12/areas.svg', 'utf8')
        const floorMap15 = await fs.readFile('./model/migrations/maps/br/rochavera/15/areas.svg', 'utf8')
        const floorMap16 = await fs.readFile('./model/migrations/maps/br/rochavera/16/areas.svg', 'utf8')
        const floorMap17 = await fs.readFile('./model/migrations/maps/br/rochavera/17/areas.svg', 'utf8')

        const floors = await queryInterface.bulkInsert(
            'floors',
            [
                { number: 9, map: floorMap9, buildingId: buildingId, startDate },
                { number: 12, map: floorMap12, buildingId: buildingId, startDate },
                { number: 15, map: floorMap15, buildingId: buildingId, startDate },
                { number: 16, map: floorMap16, buildingId: buildingId, startDate },
                { number: 17, map: floorMap17, buildingId: buildingId, startDate },
            ],
            options
        )
        const floorIdx = floors.reduce(reducerFloor, {})
        for (let i = 0; i < brasilData.length; i++) {
            brasilData[i].floorId = floorIdx[brasilData[i].floor]
        }


        /** * Areas ***/

        const areas = await queryInterface.bulkInsert(
            'areas',
            [
                {
                    code: 'a',
                    map: await fs.readFile('./model/migrations/maps/br/rochavera/9/a.svg', 'utf8'),
                    floorId: floorIdx[9],
                    startDate,
                },
                {
                    code: 'b',
                    map: await fs.readFile('./model/migrations/maps/br/rochavera/9/b.svg', 'utf8'),
                    floorId: floorIdx[9],
                    startDate,
                },
                {
                    code: 'c',
                    map: await fs.readFile('./model/migrations/maps/br/rochavera/9/c.svg', 'utf8'),
                    floorId: floorIdx[9],
                    startDate,
                },
                {
                    code: 'a1',
                    map: await fs.readFile('./model/migrations/maps/br/rochavera/12/a1.svg', 'utf8'),
                    floorId: floorIdx[12],
                    startDate,
                },
                {
                    code: 'a2',
                    map: await fs.readFile('./model/migrations/maps/br/rochavera/12/a2.svg', 'utf8'),
                    floorId: floorIdx[12],
                    startDate,
                },
                {
                    code: 'b1',
                    map: await fs.readFile('./model/migrations/maps/br/rochavera/12/b1.svg', 'utf8'),
                    floorId: floorIdx[12],
                    startDate,
                },
                {
                    code: 'b2',
                    map: await fs.readFile('./model/migrations/maps/br/rochavera/12/b2.svg', 'utf8'),
                    floorId: floorIdx[12],
                    startDate,
                },
                {
                    code: 'c1',
                    map: await fs.readFile('./model/migrations/maps/br/rochavera/12/c1.svg', 'utf8'),
                    floorId: floorIdx[12],
                    startDate,
                },
                {
                    code: 'c2',
                    map: await fs.readFile('./model/migrations/maps/br/rochavera/12/c2.svg', 'utf8'),
                    floorId: floorIdx[12],
                    startDate,
                },
                {
                    code: 'a1',
                    map: await fs.readFile('./model/migrations/maps/br/rochavera/15/a1.svg', 'utf8'),
                    floorId: floorIdx[15],
                    startDate,
                },
                {
                    code: 'a2',
                    map: await fs.readFile('./model/migrations/maps/br/rochavera/15/a2.svg', 'utf8'),
                    floorId: floorIdx[15],
                    startDate,
                },
                {
                    code: 'b1',
                    map: await fs.readFile('./model/migrations/maps/br/rochavera/15/b1.svg', 'utf8'),
                    floorId: floorIdx[15],
                    startDate,
                },
                {
                    code: 'b2',
                    map: await fs.readFile('./model/migrations/maps/br/rochavera/15/b2.svg', 'utf8'),
                    floorId: floorIdx[15],
                    startDate,
                },
                {
                    code: 'c1',
                    map: await fs.readFile('./model/migrations/maps/br/rochavera/15/c1.svg', 'utf8'),
                    floorId: floorIdx[15],
                    startDate,
                },
                {
                    code: 'c2',
                    map: await fs.readFile('./model/migrations/maps/br/rochavera/15/c2.svg', 'utf8'),
                    floorId: floorIdx[15],
                    startDate,
                },
                {
                    code: 'a1',
                    map: await fs.readFile('./model/migrations/maps/br/rochavera/16/a1.svg', 'utf8'),
                    floorId: floorIdx[16],
                    startDate,
                },
                {
                    code: 'a2',
                    map: await fs.readFile('./model/migrations/maps/br/rochavera/16/a2.svg', 'utf8'),
                    floorId: floorIdx[16],
                    startDate,
                },
                {
                    code: 'b1',
                    map: await fs.readFile('./model/migrations/maps/br/rochavera/16/b1.svg', 'utf8'),
                    floorId: floorIdx[16],
                    startDate,
                },
                {
                    code: 'b2',
                    map: await fs.readFile('./model/migrations/maps/br/rochavera/16/b2.svg', 'utf8'),
                    floorId: floorIdx[16],
                    startDate,
                },
                {
                    code: 'c1',
                    map: await fs.readFile('./model/migrations/maps/br/rochavera/16/c1.svg', 'utf8'),
                    floorId: floorIdx[16],
                    startDate,
                },
                {
                    code: 'c2',
                    map: await fs.readFile('./model/migrations/maps/br/rochavera/16/c2.svg', 'utf8'),
                    floorId: floorIdx[16],
                    startDate,
                },
                {
                    code: 'a1',
                    map: await fs.readFile('./model/migrations/maps/br/rochavera/17/a1.svg', 'utf8'),
                    floorId: floorIdx[17],
                    startDate,
                },
                {
                    code: 'a2',
                    map: await fs.readFile('./model/migrations/maps/br/rochavera/17/a2.svg', 'utf8'),
                    floorId: floorIdx[17],
                    startDate,
                },
                {
                    code: 'b1',
                    map: await fs.readFile('./model/migrations/maps/br/rochavera/17/b1.svg', 'utf8'),
                    floorId: floorIdx[17],
                    startDate,
                },
                {
                    code: 'b2',
                    map: await fs.readFile('./model/migrations/maps/br/rochavera/17/b2.svg', 'utf8'),
                    floorId: floorIdx[17],
                    startDate,
                },
            ],
            options
        )
        const areasIdx = areas.reduce(reducerAreas, {})

        for (let i = 0; i < brasilData.length; i++) {
            brasilData[i].areaId = areasIdx[brasilData[i].floorId + '-' + brasilData[i].area]
        }

        /** * Seats ***/
        const seats = await queryInterface.bulkInsert(
            'seats',
            brasilData.map(({ seat, areaId, available }) => {
                return { code: seat, areaId, startDate, endDate: available ? null : endDate }
            }),
            options
        )

        await transaction.commit()
    },

    down: async (queryInterface, Sequelize) => {},
}
