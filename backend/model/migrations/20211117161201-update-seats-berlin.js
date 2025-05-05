const { promises: fs } = require('fs')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(
      `WITH AUX AS (
        SELECT 'OBC03' AS building_name, 0 AS floor_number,  'O' AS area_code, generate_series(4, 6) AS seat_code UNION ALL
        SELECT 'OBC03' AS building_name, 4 AS floor_number, 'O' AS area_code, generate_series(15, 24) AS seat_code)
        INSERT INTO public.seats(code, "areaId", "startDate", "endDate", "createdAt", "updatedAt")
        SELECT seat_code AS code, a.id AS "areaId", '2021-01-01' AS "startDate",'2021-11-18' AS "endDate",current_date AS "createdAt",current_date AS "updatedAt"
        FROM AUX, areas a
                    INNER JOIN floors f ON f.id = a."floorId"
                    INNER JOIN buildings b ON b.id = f."buildingId"
        WHERE a.code = area_code AND f."number" = floor_number AND b.name = building_name;`
    )
  },

  down: async (queryInterface, Sequelize) => {},
}
