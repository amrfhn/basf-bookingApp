const { getSequelize, DataTypes, Model } = require('../config')
class InteropStaging extends Model {}
/**
 * @swagger
 * components:
 *   securitySchemes:
 *     oauth2:
 *       type: oauth2
 *       flows:
 *         clientCredentials:
 *           tokenUrl: 'https://federation-qa.basf.com/nidp/oauth/nam/token'
 *           refreshUrl: ''
 *           scopes: {}
 *   schemas:
 *     BMInterop-workspace-layout:
 *       required:
 *         - floorId
 *         - scalableVectorGraphic
 *       type: object
 *       properties:
 *         floorId:
 *           $ref: "#/components/schemas/FloorId"
 *         scalableVectorGraphic:
 *           $ref: "#/components/schemas/ScalableVectorGraphic"
 *         validFrom:
 *           $ref: "#/components/schemas/ValidFromOptional"
 *     BMInterop-workspace:
 *       required:
 *         - availableResources
 *         - workspaceId
 *         - floorId
 *         - name
 *         - type
 *         - bookable
 *       type: object
 *       properties:
 *         characteristics:
 *           $ref: "#/components/schemas/CharacteristicsOptional"
 *         availableResources:
 *           $ref: "#/components/schemas/AvailableResources"
 *         workspaceId:
 *           $ref: "#/components/schemas/WorkspaceId"
 *         neighbourhoodId:
 *           $ref: "#/components/schemas/NeighbourhoodIdOptional"
 *         workAreaId:
 *           $ref: "#/components/schemas/WorkAreaIdOptional"
 *         floorId:
 *           $ref: "#/components/schemas/FloorId"
 *         spaceId:
 *           $ref: "#/components/schemas/SpaceIdOptional"
 *         name:
 *           $ref: "#/components/schemas/Name"
 *         workspaceCode:
 *           $ref: "#/components/schemas/WorkspaceCodeOptional"
 *         type:
 *           description: Type of workplace
 *           type: string
 *         capacity:
 *           $ref: "#/components/schemas/CapacityOptional"
 *         bookable:
 *           $ref: "#/components/schemas/Bookable"
 *         validFrom:
 *           $ref: "#/components/schemas/ValidFromOptional"
 *         validUntil:
 *           $ref: "#/components/schemas/ValidUntilOptional"
 *     BMInterop-neighbourhood:
 *       required:
 *         - workspaceIds
 *         - tags
 *         - neighbourhoodId
 *         - name
 *         - siteId
 *       type: object
 *       properties:
 *         workspaceIds:
 *           $ref: "#/components/schemas/WorkspaceIds"
 *         tags:
 *           $ref: "#/components/schemas/Tags"
 *         neighbourhoodId:
 *           $ref: "#/components/schemas/NeighbourhoodId"
 *         name:
 *           $ref: "#/components/schemas/Name"
 *         siteId:
 *           $ref: "#/components/schemas/SiteId"
 *         organisationId:
 *           $ref: "#/components/schemas/OrganisationIdOptional"
 *         validFrom:
 *           $ref: "#/components/schemas/ValidFromOptional"
 *         validUntil:
 *           $ref: "#/components/schemas/ValidUntilOptional"
 *         color:
 *           $ref: "#/components/schemas/ColorOptional"
 *         characteristics:
 *           $ref: "#/components/schemas/CharacteristicsOptional"
 *     BMInterop-site:
 *       required:
 *         - siteId
 *         - name
 *       type: object
 *       properties:
 *         siteId:
 *           $ref: "#/components/schemas/SiteId"
 *         name:
 *           $ref: "#/components/schemas/Name"
 *         validFrom:
 *           $ref: "#/components/schemas/ValidFromOptional"
 *         validUntil:
 *           $ref: "#/components/schemas/ValidUntilOptional"
 *         addressIds:
 *           $ref: "#/components/schemas/AddressIdsOptional"
 *         areaMeasurementIds:
 *           $ref: "#/components/schemas/AreaMeasurementIdsOptional"
 *         rentalUnitId:
 *           $ref: "#/components/schemas/RentalUnitIdOptional"
 *         organisationIds:
 *           $ref: "#/components/schemas/OrganisationIdsOptional"
 *         contactIds:
 *           $ref: "#/components/schemas/ContactIdsOptional"
 *         buildingIds:
 *           $ref: "#/components/schemas/BuildingIdsOptional"
 *         landIds:
 *           $ref: "#/components/schemas/LandIdsOptional"
 *         siteCode:
 *           $ref: "#/components/schemas/SiteCodeOptional"
 *         type:
 *           $ref: "#/components/schemas/TypeOptional"
 *         status:
 *           $ref: "#/components/schemas/StatusOptional"
 *     BMInterop-building:
 *       required:
 *         - buildingId
 *         - siteId
 *         - name
 *       type: object
 *       properties:
 *         buildingId:
 *           $ref: "#/components/schemas/BuildingId"
 *         siteId:
 *           $ref: "#/components/schemas/SiteId"
 *         name:
 *           $ref: "#/components/schemas/Name"
 *         validFrom:
 *           $ref: "#/components/schemas/ValidFromOptional"
 *         validUntil:
 *           $ref: "#/components/schemas/ValidUntilOptional"
 *         addressIds:
 *           $ref: "#/components/schemas/AddressIdsOptional"
 *         areaMeasurementIds:
 *           $ref: "#/components/schemas/AreaMeasurementIdsOptional"
 *         rentalUnitId:
 *           $ref: "#/components/schemas/RentalUnitIdOptional"
 *         organisationIds:
 *           $ref: "#/components/schemas/OrganisationIdsOptional"
 *         contactIds:
 *           $ref: "#/components/schemas/ContactIdsOptional"
 *         floorIds:
 *           $ref: "#/components/schemas/FloorIdsOptional"
 *         buildingCode:
 *           $ref: "#/components/schemas/BuildingCodeOptional"
 *         primaryTypeOfBuilding:
 *           $ref: "#/components/schemas/PrimaryTypeOfBuildingOptional"
 *         secondaryTypeOfBuilding:
 *           $ref: "#/components/schemas/SecondaryTypeOfBuildingOptional"
 *         energyEfficiencyClass:
 *           $ref: "#/components/schemas/EnergyEfficiencyClassOptional"
 *         constructionYear:
 *           $ref: "#/components/schemas/ConstructionYearOptional"
 *         yearOfLastRefurbishment:
 *           $ref: "#/components/schemas/YearOfLastRefurbishmentOptional"
 *         monumentProtection:
 *           $ref: "#/components/schemas/MonumentProtectionOptional"
 *         typeOfOwnership:
 *           $ref: "#/components/schemas/TypeOfOwnershipOptional"
 *         selfUse:
 *           $ref: "#/components/schemas/SelfUseOptional"
 *         tenantStructure:
 *           $ref: "#/components/schemas/TenantStructureOptional"
 *         parkingSpaces:
 *           $ref: "#/components/schemas/ParkingSpacesOptional"
 *         electricVehicleChargingStations:
 *           $ref: "#/components/schemas/ElectricVehicleChargingStationsOptional"
 *         primaryEnergyType:
 *           $ref: "#/components/schemas/PrimaryEnergyTypeOptional"
 *         primaryWaterType:
 *           $ref: "#/components/schemas/PrimaryWaterTypeOptional"
 *         primaryHeatingType:
 *           $ref: "#/components/schemas/PrimaryHeatingTypeOptional"
 *         secondaryHeatingType:
 *           $ref: "#/components/schemas/SecondaryHeatingTypeOptional"
 *         airConditioning:
 *           $ref: "#/components/schemas/AirConditioningOptional"
 *         status:
 *           $ref: "#/components/schemas/StatusOptional"
 *         numberOfEmployees:
 *           $ref: "#/components/schemas/NumberOfEmployeesOptional"
 *     BMInterop-floor:
 *       required:
 *         - floorId
 *         - buildingId
 *         - name
 *       type: object
 *       properties:
 *         floorId:
 *           $ref: "#/components/schemas/FloorId"
 *         buildingId:
 *           $ref: "#/components/schemas/BuildingId"
 *         name:
 *           $ref: "#/components/schemas/Name"
 *         validFrom:
 *           $ref: "#/components/schemas/ValidFromOptional"
 *         validUntil:
 *           $ref: "#/components/schemas/ValidUntilOptional"
 *         spaceIds:
 *           $ref: "#/components/schemas/SpaceIdsOptional"
 *         areaMeasurementIds:
 *           $ref: "#/components/schemas/AreaMeasurementIdsOptional"
 *         floorCode:
 *           $ref: "#/components/schemas/FloorCodeOptional"
 *         floorNumber:
 *           $ref: "#/components/schemas/FloorNumberOptional"
 *     FloorId:
 *       description: Unique identifier mapped to the floor and area in FoW
 *       type: string
 *       format: uuid
 *       example: 0aaa46f7-2fab-4716-8f13-11787f05ihh5
 *     FloorIdAsObj:
 *       type: object
 *       properties:
 *         floorId:
 *           $ref: "#/components/schemas/FloorId"
 *     SpaceIdOptional:
 *       description: Unique identifier either coming from previous system otherwise it needs to be defined. Even though this field is allowed to be received, it's not currently processed.
 *       type: string
 *       format: uuid
 *       example: 0aaa46f7-2fab-4716-8f13-11787f05ihh5
 *     ScalableVectorGraphic:
 *       description: The scalable vector graphic (SVG) of the floor plan with the workspace layout as a base64
 *       type: string
 *       format: byte
 *     ValidFrom:
 *       description: The object (seat, floor, building, site, neighbourhood) is valid from in yyyy-mm-ddThh:mm:ssZ form (conform to ISO 8061)
 *       type: string
 *       format: date-time
 *       example: "2017-06-23T00:00:0000000Z"
 *     ValidFromAsObj:
 *       type: object
 *       properties:
 *         validFrom:
 *           $ref: "#/components/schemas/ValidFrom"
 *     ValidFromOptional:
 *       description: The object (seat, floor, building, site, neighbourhood) is valid from in yyyy-mm-ddThh:mm:ssZ form (conform to ISO 8061). Even though this field is allowed to be received, it's not currently processed.
 *       type: string
 *       format: date-time
 *       example: "2017-06-23T00:00:0000000Z"
 *     ValidUntil:
 *       description: The workspace is valid until in yyyy-mm-ddThh:mm:ssZ form (conform to ISO 8061)
 *       type: string
 *       format: date-time
 *       example: "2017-06-23T00:00:0000000Z"
 *     ValidUntilAsObj:
 *       type: object
 *       properties:
 *         validUntil:
 *           $ref: "#/components/schemas/ValidUntil"
 *     ValidUntilOptional:
 *       description: The workspace is valid until in yyyy-mm-ddThh:mm:ssZ form (conform to ISO 8061). Even though this field is allowed to be received, it's not currently processed.
 *       type: string
 *       format: date-time
 *       example: "2017-06-23T00:00:0000000Z"
 *     AvailableResources:
 *       description: Amenities (mapped in Building Minds to the Available resources) on seats (empty array is considered valid)
 *       type: array
 *       items:
 *         $ref: '#/components/schemas/AvailableResourcesObjElem'
 *     AvailableResourcesObjElem:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         availableResourceId:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *     AvailableResourcesAsObj:
 *       type: object
 *       properties:
 *         availableResources:
 *           $ref: "#/components/schemas/AvailableResources"
 *     CharacteristicsOptional:
 *       description: Characteristics of Workspace. Even though this field is allowed to be received, it's not currently processed.
 *       type: array
 *       items:
 *         type: string
 *     WorkspaceId:
 *       description: Unique identifier mapped to the seat in FoW
 *       type: string
 *       format: uuid
 *     WorkspaceIds:
 *       description: Array of workspace Ids (mapped in FoW with the seats)
 *       type: array
 *       items:
 *         type: string
 *     WorkspaceIdsAsObj:
 *       type: object
 *       properties:
 *         workspaceIds:
 *           $ref: "#/components/schemas/WorkspaceIds"
 *     NeighbourhoodId:
 *       description: Unique identifier mapped to the hoods in FoW
 *       type: string
 *       format: uuid
 *     NeighbourhoodIdAsObj:
 *       type: object
 *       properties:
 *         neighbourhoodId:
 *           $ref: "#/components/schemas/NeighbourhoodId"
 *     NeighbourhoodIdOptional:
 *       description: Unique identifier mapped to the hoods in FoW. Even though this field is allowed to be received, it's not currently processed.
 *       type: string
 *       format: uuid
 *     WorkAreaIdOptional:
 *       description: Unique identifier either coming from previous system otherwise it needs to be defined. Even though this field is allowed to be received, it's not currently processed.
 *       type: string
 *       format: uuid
 *     WorkspaceCodeOptional:
 *       description: User specific work space code. Even though this field is allowed to be received, it's not currently processed.
 *       type: string
 *     CapacityOptional:
 *       description: Capacity of workplace. Even though this field is allowed to be received, it's not currently processed.
 *       type: integer
 *     OrganisationIdOptional:
 *       description: Unique identifier either coming from previous system otherwise it needs to be defined. Even though this field is allowed to be received, it's not currently processed.
 *       type: string
 *     OrganisationIdsOptional:
 *       description: Array of organisation Ids. Even though this field is allowed to be received, it's not currently processed.
 *       type: array
 *       items:
 *         type: string
 *     ContactIdsOptional:
 *       description: Array of contact Ids. Even though this field is allowed to be received, it's not currently processed.
 *       type: array
 *       items:
 *         type: string
 *     FloorIdsOptional:
 *       description: Array of floor Ids. Even though this field is allowed to be received, it's not currently processed.
 *       type: array
 *       items:
 *         type: string
 *     BuildingCodeOptional:
 *       description: User specific Building Code. Even though this field is allowed to be received, it's not currently processed.
 *       type: string
 *     PrimaryTypeOfBuildingOptional:
 *       description: Type of building use. Even though this field is allowed to be received, it's not currently processed.
 *       type: string
 *       enum:
 *         - Retail
 *         - Retail, High Street
 *         - Retail, Retail Centers
 *         - Retail, Shopping Center
 *         - Retail, Strip Mall
 *         - Retail, Lifestyle Center
 *         - Retail, Warehouse
 *         - Retail, Restaurants Bars
 *         - Retail, Other
 *         - Office
 *         - Office, Corporate
 *         - Office, Low-Rise Office
 *         - Office, Mid-Rise Office
 *         - Office, High-Rise Office
 *         - Office, Medical Office
 *         - Office, Business Park
 *         - Office, Other
 *         - Industrial
 *         - Industrial, Distribution Warehouse
 *         - Industrial, Industrial Park
 *         - Industrial, Manufacturing
 *         - Industrial, Other
 *         - Residential
 *         - Residential, Multi Family
 *         - Residential, Low-Rise Multi-Family
 *         - Residential, Mid-Rise Multi-Family
 *         - Residential, High-Rise Multi-Family
 *         - Residential, Family Homes
 *         - Residential, Student Housing
 *         - Residential, Retirement Living
 *         - Residential, Other
 *         - Hotel
 *         - Lodging, Leisure & Recreation
 *         - Lodging, Leisure & Recreation, Indoor Arena
 *         - Lodging, Leisure & Recreation, Fitness Center
 *         - Lodging, Leisure & Recreation, Performing Arts
 *         - Lodging, Leisure & Recreation, Swimming Center
 *         - Lodging, Leisure & Recreation, Museum Gallery
 *         - Lodging, Leisure & Recreation, Other
 *         - Education
 *         - Education, School
 *         - Education, University
 *         - Education, Library
 *         - Education, Other
 *         - Technology/Science
 *         - Technology/Science, Data Center
 *         - Technology/Science, Laboratory/ Life sciences
 *         - Technology/Science, Other
 *         - Health Care
 *         - Health Care, Health Care Center
 *         - Health Care, Senior Homes
 *         - Health Care, Other
 *         - Mixed Use
 *         - Mixed Use, Office/Retail
 *         - Mixed Use, Office/Residential
 *         - Mixed Use, Office Industrial
 *         - Mixed Use, Other
 *         - Other
 *         - Other, Parking (Indoors)
 *         - Other, Self-Storage
 *     SecondaryTypeOfBuildingOptional:
 *       description: Second type of building use. Even though this field is allowed to be received, it's not currently processed.
 *       type: string
 *       enum:
 *         - Retail
 *         - Retail, High Street
 *         - Retail, Retail Centers
 *         - Retail, Shopping Center
 *         - Retail, Strip Mall
 *         - Retail, Lifestyle Center
 *         - Retail, Warehouse
 *         - Retail, Restaurants Bars
 *         - Retail, Other
 *         - Office
 *         - Office, Corporate
 *         - Office, Low-Rise Office
 *         - Office, Mid-Rise Office
 *         - Office, High-Rise Office
 *         - Office, Medical Office
 *         - Office, Business Park
 *         - Office, Other
 *         - Industrial
 *         - Industrial, Distribution Warehouse
 *         - Industrial, Industrial Park
 *         - Industrial, Manufacturing
 *         - Industrial, Other
 *         - Residential
 *         - Residential, Multi Family
 *         - Residential, Low-Rise Multi-Family
 *         - Residential, Mid-Rise Multi-Family
 *         - Residential, High-Rise Multi-Family
 *         - Residential, Family Homes
 *         - Residential, Student Housing
 *         - Residential, Retirement Living
 *         - Residential, Other
 *         - Hotel
 *         - Lodging, Leisure & Recreation
 *         - Lodging, Leisure & Recreation, Indoor Arena
 *         - Lodging, Leisure & Recreation, Fitness Center
 *         - Lodging, Leisure & Recreation, Performing Arts
 *         - Lodging, Leisure & Recreation, Swimming Center
 *         - Lodging, Leisure & Recreation, Museum Gallery
 *         - Lodging, Leisure & Recreation, Other
 *         - Education
 *         - Education, School
 *         - Education, University
 *         - Education, Library
 *         - Education, Other
 *         - Technology/Science
 *         - Technology/Science, Data Center
 *         - Technology/Science, Laboratory/ Life sciences
 *         - Technology/Science, Other
 *         - Health Care
 *         - Health Care, Health Care Center
 *         - Health Care, Senior Homes
 *         - Health Care, Other
 *         - Mixed Use
 *         - Mixed Use, Office/Retail
 *         - Mixed Use, Office/Residential
 *         - Mixed Use, Office Industrial
 *         - Mixed Use, Other
 *         - Other
 *         - Other, Parking (Indoors)
 *         - Other, Self-Storage
 *     EnergyEfficiencyClassOptional:
 *       description: Energy Efficiency Class of Building. Even though this field is allowed to be received, it's not currently processed.
 *       type: string
 *     ConstructionYearOptional:
 *       description: Year of construction in yyyy-mm-ddThh:mm:ssZ form (conform ISO 8061). In case only year exists use yyyy-01-01T00:00:00Z. Even though this field is allowed to be received, it's not currently processed.
 *       type: string
 *     YearOfLastRefurbishmentOptional:
 *       description: Year of last refurbishment took place in yyyy-mm-ddThh:mm:ssZ form (conform ISO 8061). In case only year exists use yyyy-01-01T00:00:00Z. Even though this field is allowed to be received, it's not currently processed.
 *       type: string
 *     MonumentProtectionOptional:
 *       description: The building is declared to be an ancient monument with national importance by the government. Even though this field is allowed to be received, it's not currently processed.
 *       type: boolean
 *     TypeOfOwnershipOptional:
 *       description: Is the building owned or leased. Even though this field is allowed to be received, it's not currently processed.
 *       type: string
 *       enum:
 *         - Owner
 *         - Tenant
 *     SelfUseOptional:
 *       description: Is building self used or not (Y/N). Even though this field is allowed to be received, it's not currently processed.
 *       type: boolean
 *     TenantStructureOptional:
 *       description: Is there multiple tenants in the building or only one. Even though this field is allowed to be received, it's not currently processed.
 *       type: string
 *       enum:
 *         - Single-tenant
 *         - Multi-tenant
 *     ParkingSpacesOptional:
 *       description: Number of parking spaces. Even though this field is allowed to be received, it's not currently processed.
 *       type: number
 *     ElectricVehicleChargingStationsOptional:
 *       description: Number of electric vehicle charging stations. Even though this field is allowed to be received, it's not currently processed.
 *       type: number
 *     PrimaryEnergyTypeOptional:
 *       description: Type of energy used. Even though this field is allowed to be received, it's not currently processed.
 *       type: string
 *       enum:
 *         - Natural gas
 *         - Coal
 *         - Nuclear
 *         - Petroleum
 *         - Hydropower
 *         - Wind
 *         - Biomass
 *         - Geothermal
 *         - Solar
 *     PrimaryWaterTypeOptional:
 *       description: Type of water used. Even though this field is allowed to be received, it's not currently processed.
 *       type: string
 *     PrimaryHeatingTypeOptional:
 *       description: Primary Type of heating. Even though this field is allowed to be received, it's not currently processed.
 *       type: string
 *       enum:
 *         - District heating
 *         - Natural gas
 *         - Oil-based fuels
 *         - Solar thermal
 *         - Unspecified
 *         - Heat pump
 *         - Electricity (radiator)
 *         - Biomass
 *         - Micro combined heat and power
 *     SecondaryHeatingTypeOptional:
 *       description: Secondary Type of heating. Even though this field is allowed to be received, it's not currently processed.
 *       type: string
 *       enum:
 *         - District heating
 *         - Natural gas
 *         - Oil-based fuels
 *         - Solar thermal
 *         - Unspecified
 *         - Heat pump
 *         - Electricity (radiator)
 *         - Biomass
 *         - Micro combined heat and power
 *     AirConditioningOptional:
 *       description: Does the building have air conditioning (Y/N) (Needed for precise future emissions projection of building). Even though this field is allowed to be received, it's not currently processed.
 *       type: boolean
 *     BuildingIdsOptional:
 *       description: Array of building Ids. Even though this field is allowed to be received, it's not currently processed.
 *       type: array
 *       items:
 *         type: string
 *     LandIdsOptional:
 *       description: Array of land Ids. Even though this field is allowed to be received, it's not currently processed.
 *       type: array
 *       items:
 *         type: string
 *     SiteCodeOptional:
 *       description: User specific Site Code. Even though this field is allowed to be received, it's not currently processed.
 *       type: string
 *     TypeOptional:
 *       description: Type of site. Even though this field is allowed to be received, it's not currently processed.
 *       type: string
 *       enum:
 *         - Education
 *         - Health Care
 *         - Hotel
 *         - Industrial
 *         - Lodging, Leisure & Recreation
 *         - Mixed Use
 *         - Office
 *         - Residential
 *         - Retail
 *         - Technology/Science
 *         - Other
 *     StatusOptional:
 *       description: Status of Site/Building. Even though this field is allowed to be received, it's not currently processed.
 *       type: string
 *     NumberOfEmployeesOptional:
 *       description: Number of employees. Even though this field is allowed to be received, it's not currently processed.
 *       type: number
 *     SpaceIdsOptional:
 *       description: Array of area space Ids. Even though this field is allowed to be received, it's not currently processed.
 *       type: array
 *       items:
 *         type: string
 *     ColorOptional:
 *       description: User specific color code. Even though this field is allowed to be received, it's not currently processed.
 *       type: string
 *     AreaMeasurementIdsOptional:
 *       description: Array of area measurement Ids
 *       type: array
 *       items:
 *         type: string
 *     FloorCodeOptional:
 *       description: User specific Floor Code. Even though this field is allowed to be received, it's not currently processed.
 *       type: string
 *     FloorNumberOptional:
 *       description: Number of floor. Even though this field is allowed to be received, it's not currently processed.
 *       type: number
 *     RentalUnitIdOptional:
 *       description: Array of rental unit ids
 *       type: array
 *       items:
 *         type: string
 *     Name:
 *       description: User specific name of object (seat, floor, building, site, neighbourhood). For the specific workspace event, the name cannot be repeated in the same Floor where it is.
 *       type: string
 *     NameAsObj:
 *       type: object
 *       properties:
 *         name:
 *           $ref: "#/components/schemas/Name"
 *     Bookable:
 *       description: Is the workplace bookable/available
 *       type: boolean
 *     BookableAsObj:
 *       type: object
 *       properties:
 *         bookable:
 *           $ref: "#/components/schemas/Bookable"
 *     Tags:
 *       description: Customer defined “tag” information on neighbourhood (mapped in FoW with the Org codes of the hoods)
 *       type: array
 *       items:
 *         type: string
 *       example:
 *         - GB/CD
 *         - GDE/BG
 *         - GB/H
 *     TagsAsObj:
 *       type: object
 *       properties:
 *         tags:
 *           $ref: "#/components/schemas/Tags"
 *     SiteId:
 *       description: Unique identifier mapped to the sites in FoW
 *       type: string
 *       format: uuid
 *     SiteIdAsObj:
 *       type: object
 *       properties:
 *         siteId:
 *           $ref: "#/components/schemas/SiteId"
 *     BuildingId:
 *       description: Unique identifier mapped to the buildings in FoW
 *       type: string
 *       format: uuid
 *     BuildingIdAsObj:
 *       type: object
 *       properties:
 *         buildingId:
 *           $ref: "#/components/schemas/BuildingId"
 *     AddressIdsOptional:
 *       description: Array of address ids. Even though this field is allowed to be received, it's not currently processed.
 *       type: array
 *       items:
 *         type: string
 *     ApiErrorResponses:
 *       type: object
 *       properties:
 *         type:
 *           type: string
 *         message:
 *           type: string
 *         code:
 *           type: integer
 */

module.exports = InteropStaging

InteropStaging.init(
  {
    eventSchema: DataTypes.STRING,
    eventSchemaInstance: DataTypes.STRING,
    eventTimestamp: DataTypes.BIGINT,
  },
  { sequelize: getSequelize(), modelName: 'interopStaging' }
)
