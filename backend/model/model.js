// The Entities order must follow dependency criteria
const { getSequelize } = require('./config')
const { Op, fn, col } = require('sequelize')

const Site = require('./entities/Site')
const Building = require('./entities/Building')
const Floor = require('./entities/Floor')
const Area = require('./entities/Area')
const Seat = require('./entities/Seat')
const Hood = require('./entities/Hood')
const HoodOrgCode = require('./entities/HoodOrgCode')
const SeatHood = require('./entities/SeatHood')
const SeatOwner = require('./entities/SeatOwner')
const SeatPreferable = require('./entities/SeatPreferable')
const Booking = require('./entities/Booking')
const BookingStatus = require('./entities/BookingStatus')
const ExternalUser = require('./entities/ExternalUser')
const Calendar = require('./entities/Calendar')
const Amenity = require('./entities/Amenity')
const AmenityValue = require('./entities/AmenityValue')
const SeatAmenity = require('./entities/SeatAmenity')
const SeatAmenityNumericValue = require('./entities/SeatAmenityNumericValue')
const SeatAmenityBooleanValue = require('./entities/SeatAmenityBooleanValue')
const SeatAmenityMultiValue = require('./entities/SeatAmenityMultiValue')
const Brigadier = require('./entities/Brigadier')
const WorkStream = require('./entities/WorkStream')
const WorkStreamOrgCode = require('./entities/WorkStreamOrgCode')
const Event = require('./entities/Event')
const WorkspaceType = require('./entities/WorkspaceType')
const UserParkingAccess = require('./entities/UserParkingAccess')
const InteropStaging = require('./entities/InteropStaging')
const BookingCheckInStatus = require('./entities/BookingCheckInStatus')
const QuickBooking = require('./entities/QuickBooking')
const QuickBookingStatus = require('./entities/QuickBookStatus')
const UserDetail = require('./entities/UserDetail')
const BookingsMeta = require('./entities/BookingsMeta')

const config = {
  sequelize: getSequelize(),
  Op,
  fn,
  col,
  raw: true,
  nest: true,
  nested: true,
  all: true,
  subQuery: false,
}
module.exports = {
  config,
  Site,
  Building,
  Floor,
  Area,
  Seat,
  Hood,
  HoodOrgCode,
  SeatHood,
  SeatOwner,
  SeatPreferable,
  Booking,
  BookingStatus,
  ExternalUser,
  Calendar,
  Amenity,
  AmenityValue,
  SeatAmenityNumericValue,
  SeatAmenityBooleanValue,
  SeatAmenityMultiValue,
  SeatAmenity,
  Brigadier,
  WorkStream,
  WorkStreamOrgCode,
  Event,
  WorkspaceType,
  UserParkingAccess,
  InteropStaging,
  BookingCheckInStatus,
  QuickBooking,
  QuickBookingStatus,
  UserDetail,
  BookingsMeta
}

// Relationships must be added here down below

// Building relationships
Site.hasMany(Building, { foreignKey: 'siteId' })
Building.belongsTo(Site, { foreignKey: 'siteId' })

// Floor relationships
Building.hasMany(Floor, { foreignKey: 'buildingId' })
Floor.belongsTo(Building, { foreignKey: 'buildingId' })

// Area relationships
Floor.hasMany(Area, { foreignKey: 'floorId' })
Area.belongsTo(Floor, { foreignKey: 'floorId' })

// Seat relationships
Area.hasMany(Seat, { foreignKey: 'areaId' })
Seat.belongsTo(Area, { foreignKey: 'areaId' })

Seat.hasMany(SeatOwner, { foreignKey: 'seatId' })
SeatOwner.belongsTo(Seat, { foreignKey: 'seatId' })

Seat.hasMany(SeatPreferable, { foreignKey: 'seatId' })
SeatPreferable.belongsTo(Seat, { foreignKey: 'seatId' })

Seat.hasMany(SeatHood, { foreignKey: 'seatId' })
SeatHood.belongsTo(Seat, { foreignKey: 'seatId' })

Seat.hasMany(Booking, { foreignKey: 'seatId' })
Booking.belongsTo(Seat, { foreignKey: 'seatId' })

// Hood relationships
Hood.hasMany(SeatHood, { foreignKey: 'hoodId' })
SeatHood.belongsTo(Hood, { foreignKey: 'hoodId' })

Hood.hasMany(HoodOrgCode, { foreignKey: 'hoodId' })
HoodOrgCode.belongsTo(Hood, { foreignKey: 'hoodId' })

Site.hasMany(Hood, { foreignKey: 'siteId' })
Hood.belongsTo(Site, { foreignKey: 'siteId' })

// Booking relationships
BookingStatus.hasMany(Booking, { foreignKey: 'statusId' })
Booking.belongsTo(BookingStatus, { foreignKey: 'statusId' })

ExternalUser.hasOne(Booking, { foreignKey: 'externalUserId' })
Booking.belongsTo(ExternalUser, { foreignKey: 'externalUserId' })

Calendar.hasMany(Booking, { foreignKey: 'calendarId' })
Booking.belongsTo(Calendar, { foreignKey: 'calendarId' })

// Amenities relationships
Seat.hasMany(SeatAmenity, { foreignKey: 'seatId' })
SeatAmenity.belongsTo(Seat, { foreignKey: 'seatId' })
Amenity.hasMany(SeatAmenity, { foreignKey: 'amenityId' })
SeatAmenity.belongsTo(Amenity, { foreignKey: 'amenityId' })

Amenity.hasMany(AmenityValue, { foreignKey: 'amenityId' })
AmenityValue.belongsTo(Amenity, { foreignKey: 'amenityId' })

SeatAmenity.hasOne(SeatAmenityNumericValue, { foreignKey: 'seatAmenityId' })
SeatAmenityNumericValue.belongsTo(SeatAmenity, { foreignKey: 'seatAmenityId' })

SeatAmenity.hasOne(SeatAmenityBooleanValue, { foreignKey: 'seatAmenityId' })
SeatAmenityBooleanValue.belongsTo(SeatAmenity, { foreignKey: 'seatAmenityId' })

SeatAmenity.hasOne(SeatAmenityMultiValue, { foreignKey: 'seatAmenityId' })
SeatAmenityMultiValue.belongsTo(SeatAmenity, { foreignKey: 'seatAmenityId' })
AmenityValue.hasOne(SeatAmenityMultiValue, { foreignKey: 'amenityValueId' })
SeatAmenityMultiValue.belongsTo(AmenityValue, { foreignKey: 'amenityValueId' })

// WorkStream relationships
WorkStream.hasMany(WorkStreamOrgCode, { foreignKey: 'workStreamId' })
WorkStreamOrgCode.belongsTo(WorkStream, { foreignKey: 'workStreamId' })

// WorkspaceType relationships
WorkspaceType.hasMany(Seat, { foreignKey: 'typeId' })
Seat.belongsTo(WorkspaceType, { foreignKey: 'typeId' })

WorkspaceType.hasMany(Floor, { foreignKey: 'typeId' })
Floor.belongsTo(WorkspaceType, { foreignKey: 'typeId' })

WorkspaceType.hasMany(Area, { foreignKey: 'typeId' })
Area.belongsTo(WorkspaceType, { foreignKey: 'typeId' })

WorkspaceType.hasMany(Booking, { foreignKey: 'typeId' })
Booking.belongsTo(WorkspaceType, { foreignKey: 'typeId' })

// Check In relationships
BookingCheckInStatus.hasMany(Booking, { foreignKey: 'checkInStatusId' })
Booking.belongsTo(BookingCheckInStatus, { foreignKey: 'checkInStatusId' })

// Quickbooking relationships
QuickBookingStatus.hasMany(QuickBooking, { foreignKey: 'statusId' })
QuickBooking.belongsTo(QuickBookingStatus, { foreignKey: 'statusId' })

Calendar.hasMany(QuickBooking, { foreignKey: 'calendarId' })
QuickBooking.belongsTo(Calendar, { foreignKey: 'calendarId' })

Site.hasMany(QuickBooking, { foreignKey: 'siteId' })
QuickBooking.belongsTo(Site, { foreignKey: 'siteId' })

Building.hasMany(QuickBooking, { foreignKey: 'buildingId' })
QuickBooking.belongsTo(Building, { foreignKey: 'buildingId' })

// Bookings Sent to Middleware relationships
Calendar.hasMany(BookingsMeta, {foreignKey: 'calendarId'})
BookingsMeta.belongsTo(Calendar, {foreignKey: 'calendarId'})

Booking.hasMany(BookingsMeta, {foreignKey: 'bookingId'})
BookingsMeta.belongsTo(Booking, {foreignKey: 'bookingId'})