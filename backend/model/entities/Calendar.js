const { getSequelize, DataTypes, Model } = require('../config')
class Calendar extends Model {}

module.exports = Calendar

/**
 * @swagger
 * components:
 *   schemas:
 *     Calendar:
 *       required:
 *         - date
 *         - available
 *       properties:
 *         date:
 *           type: string
 *           format: dateonly
 *         available:
 *           type: boolean
 *     Calendars:
 *       type: array
 *       items:
 *         $ref: "#/components/schemas/Calendar"
 */
Calendar.init(
  {
    date: DataTypes.DATEONLY,
    available: DataTypes.BOOLEAN,
  },
  { sequelize: getSequelize(), modelName: 'calendar' }
)
