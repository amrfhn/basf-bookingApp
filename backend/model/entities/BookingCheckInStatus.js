const {getSequelize, DataTypes, Model} = require('../config')

class BookingCheckInStatus extends Model {
}

module.exports = BookingCheckInStatus

/**
 * @swagger
 * components:
 *   schemas:
 *    A360Interop-checkIn:
 *      required:
 *        - userId
 *        - event
 *      type: object
 *      properties:
 *        userId:
 *          $ref: "#/components/schemas/CardId"
 *        event:
 *          $ref: "#/components/schemas/ActionEvent"
 *    Timestamp:
 *      description: Timestamp to record when the event is trigger
 *      type: string
 *      format: date-time
 *      example: "2017-06-23T00:00:0000000Z"
 *    UserId:
 *      description: BASF employees unique id
 *      type: string
 *    ActionEvent:
 *      type: string
 *      description: Check in event type - enter or exit the entrance
 *    Check In Status:
 *      required:
 *        - status
 *      properties:
 *        status:
 *          type: string
 */
BookingCheckInStatus.init({
  status: DataTypes.STRING,
}, {sequelize: getSequelize(), modelName: 'checkInStatuses'})
