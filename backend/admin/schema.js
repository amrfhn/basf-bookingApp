const AdminBro = require('admin-bro')
const {
  Site,
  Building,
  Floor,
  Area,
  Seat,
  Hood,
  HoodOrgCode,
  SeatHood,
  SeatOwner,
  Calendar,
  BookingStatus,
  ExternalUser,
  Booking,
  Amenity,
  SeatAmenity,
  SeatAmenityNumericValue,
  SeatAmenityBooleanValue,
  Brigadier,
  WorkStream,
  WorkStreamOrgCode,
  Event,
  UserDetail
} = require('../model/model')

module.exports = function newAdminBro(rootPath) {
  return new AdminBro({
    rootPath: rootPath + '/admin',
    loginPath: rootPath + '/admin/login',
    resources: [
      {
        resource: Site,
        options: {
          listProperties: ['id', 'name', 'country', 'city', 'startDate', 'endDate', 'createdAt', 'updatedAt'],
        },
      },
      Building,
      {
        resource: Floor,
        options: { listProperties: ['number', 'buildingId', 'startDate', 'endDate', 'createdAt', 'updatedAt'] },
      },
      {
        resource: Area,
        options: { listProperties: ['code', 'floorId', 'startDate', 'endDate', 'createdAt', 'updatedAt'] },
      },
      Seat,
      Hood,
      HoodOrgCode,
      SeatHood,
      SeatOwner,
      Calendar,
      BookingStatus,
      ExternalUser,
      {
        resource: Booking,
        options: {
          listProperties: [
            'seatId',
            'calendarId',
            'reserverUserId',
            'userId',
            'externalUserId',
            'statusId',
            'updatedAt',
          ],
        },
      },
      {
        resource: Amenity,
        options: { listProperties: ['key', 'type', 'createdAt', 'updatedAt'] },
      },
      SeatAmenity,
      SeatAmenityNumericValue,
      SeatAmenityBooleanValue,
      Brigadier,
      WorkStream,
      WorkStreamOrgCode,
      Event,
      UserDetail
    ],
    branding: {
      companyName: 'BASF - GTU Montevideo',
      logo: 'https://app.roqs.basf.net/future_of_work/_nuxt/icons/icon_64x64.85bf17.png',
      softwareBrothers: false,
    },
  })
}
