const { getSequelize, DataTypes, Model } = require('../config')
class Event extends Model {}

module.exports = Event

/**
 * @swagger
 * components:
 *   schemas:
 *     Event:
 *       required:
 *         - date
 *         - userId
 *         - type
 *       properties:
 *         date:
 *           type: string
 *           format: date
 *         userId:
 *           type: string
 *         type:
 *           type: string
 *         payload:
 *           type: string
 *         userOrgCode:
 *           type: string
 *           description: user's org code
 *     Events:
 *       type: array
 *       items:
 *         $ref: "#/components/schemas/Event"
 */
Event.init(
  {
    date: DataTypes.DATE,
    userId: DataTypes.STRING,
    userOrgCode: DataTypes.STRING,
    type: DataTypes.STRING,
    payload: DataTypes.JSONB,
  },
  { sequelize: getSequelize(), modelName: 'event' }
)
