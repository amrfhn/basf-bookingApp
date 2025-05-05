const BMInteropController = require('../../controllers/BMInteropController')
const AuthController = require('../../controllers/AuthController')
const apiActionResponses = require('../ApiActionResponses')
const { Router } = require('express')
const Errors = require('../../controllers/errors/CustomErrorTypes')
const { OP_CREATE, OP_UPDATE, OP_DELETE, CREATED_STATUS_CODE, ACCEPTED_STATUS_CODE } = require('../../common/Utils')
const REQ_AUTH_HEADER = 'x-req-key'

/**
 * @swagger
 * tags:
 *   - name: BMInterop Controller
 *     description: Manage interoperability with Building Minds.
 * components:
 *   responses:
 *     NoTokenError:
 *       description: Authorization token is missing or invalid (must be prefixed with Bearer).
 *     NoPermissionsError:
 *       description: No permissions to perform this task.
 */
const router = Router()

module.exports = router

/**
 * @swagger
 * /api/bmInterop/workspace-layout:
 *   post:
 *    tags:
 *      - BMInterop Controller
 *    summary: "Create area map when any new SVG is generated from Building Minds side. As this endpoint is reachable from other internal projects only, required parameters/request body attributes are not verified here."
 *    parameters:
 *      - name: x-req-key
 *        in: header
 *        description: Key sent by the requester to be allowed to reach this endpoint
 *        required: true
 *        schema:
 *          type: string
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/BMInterop-workspace-layout"
 *    responses:
 *      '202':
 *        description: Successful operation, map will be created when the next scheduler runner is executed
 *      '401':
 *        description: Unauthorized
 *        content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponses'
 *      '404':
 *        description: May occur when the floorId received does not exist
 *        content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponses'
 *      '500':
 *        description: Internal server error
 *        content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponses'
 *   put:
 *    tags:
 *      - BMInterop Controller
 *    summary: "Update area map when any change is generated in the SVG from Building Minds side. As this endpoint is reachable from other internal projects only, required parameters/request body attributes are not verified here."
 *    parameters:
 *      - name: x-req-key
 *        in: header
 *        description: Key sent by the requester to be allowed to reach this endpoint
 *        required: true
 *        schema:
 *          type: string
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/BMInterop-workspace-layout"
 *    responses:
 *      '202':
 *        description: Successful operation, map will be created when the next scheduler runner is executed
 *      '401':
 *        description: Unauthorized
 *        content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponses'
 *      '404':
 *        description: May occur when the floorId received does not exist
 *        content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponses'
 *      '500':
 *        description: Internal server error
 *        content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponses'
 *   patch:
 *    tags:
 *      - BMInterop Controller
 *    summary: "Update area map when any change is generated in the SVG from Building Minds side. As this endpoint is reachable from other internal projects only, required parameters/request body attributes are not verified here."
 *    parameters:
 *      - name: x-req-key
 *        in: header
 *        description: Key sent by the requester to be allowed to reach this endpoint
 *        required: true
 *        schema:
 *          type: string
 *      - name: floorId
 *        in: query
 *        description: Unique identifier mapped to the floor and area in FoW
 *        required: true
 *        schema:
 *          type: string
 *          format: uuid
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            required:
 *             - scalableVectorGraphic
 *            type: object
 *            properties:
 *              scalableVectorGraphic:
 *                $ref: "#/components/schemas/ScalableVectorGraphic"
 *              validFrom:
 *                $ref: "#/components/schemas/ValidFromOptional"
 *    responses:
 *      '202':
 *        description: Successful operation, map will be updated when the next scheduler runner is executed
 *      '401':
 *        description: Unauthorized
 *        content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponses'
 *      '404':
 *        description: May occur when the floorId received does not exist
 *        content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponses'
 *      '500':
 *        description: Internal server error
 *        content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponses'
 * /api/bmInterop/workspace-layout/{floorId}:
 *   delete:
 *    tags:
 *      - BMInterop Controller
 *    summary: "Delete area map. As this endpoint is reachable from other internal projects only, required parameters/request body attributes are not verified here."
 *    parameters:
 *      - name: x-req-key
 *        in: header
 *        description: Key sent by the requester to be allowed to reach this endpoint
 *        required: true
 *        schema:
 *          type: string
 *      - name: floorId
 *        in: path
 *        description: Unique identifier mapped to the floor and area in FoW
 *        required: true
 *        schema:
 *          type: string
 *          format: uuid
 *    responses:
 *      '202':
 *        description: Successful operation, map will be deleted when the next scheduler runner is executed
 *      '401':
 *        description: Unauthorized
 *        content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponses'
 *      '404':
 *        description: May occur when the floorId received does not exist
 *        content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponses'
 *      '500':
 *        description: Internal server error
 *        content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponses'
 */

router.post('/workspace-layout', async function (req, res, _next) {
  try {
    await workspaceLayoutCRUD(req, res, OP_CREATE)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

router.put('/workspace-layout', async function (req, res, _next) {
  try {
    await workspaceLayoutCRUD(req, res, OP_UPDATE)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

router.patch('/workspace-layout', async function (req, res, _next) {
  try {
    console.log('Request arriving for workspace layout event. Operation type: ', OP_UPDATE, ' in PATCH HTTP method.')
    requesterAuthValidation(req)
    if (!(await BMInteropController.isAccessTokenValid(req.headers.authorization)))
      throw new Errors.UnauthorizedError('Invalid access token.')
    const data = req.body
    data.floorId = req.query.floorId
    data.operation = OP_UPDATE
    await BMInteropController.workSpaceLayoutTopic(data, data.operation)
    res.status(ACCEPTED_STATUS_CODE)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

router.delete('/workspace-layout/:floorId', async function (req, res, _next) {
  try {
    await workspaceLayoutCRUD(req, res, OP_DELETE)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/bmInterop/workspace:
 *   post:
 *    tags:
 *      - BMInterop Controller
 *    summary: "Creation of one seat from Building Minds side. As this endpoint is reachable from other internal projects only, required parameters/request body attributes are not verified here. Besides, it's assumed to receive workspaces with 'type = desk' only"
 *    parameters:
 *      - name: x-req-key
 *        in: header
 *        description: Key sent by the requester to be allowed to reach this endpoint
 *        required: true
 *        schema:
 *          type: string
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/BMInterop-workspace"
 *    responses:
 *      '201':
 *        description: Successful operation, seat was created successfully.
 *      '400':
 *        description: Bad Request
 *        content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponses'
 *      '401':
 *        description: Unauthorized
 *        content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponses'
 *      '409':
 *        description: May occur when cannot create workspace because it does not exist an area associated to the floor where it has to be assigned on
 *        content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponses'
 *      '500':
 *        description: Internal server error
 *        content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponses'
 *   put:
 *    tags:
 *      - BMInterop Controller
 *    summary: "Update seat from Building Minds side. As this endpoint is reachable from other internal projects only, required parameters/request body attributes are not verified here. Besides, it's assumed to receive workspaces with 'type = desk' only"
 *    parameters:
 *      - name: x-req-key
 *        in: header
 *        description: Key sent by the requester to be allowed to reach this endpoint
 *        required: true
 *        schema:
 *          type: string
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/BMInterop-workspace"
 *    responses:
 *      '202':
 *        description: Successful operation, seat will be updated when the next scheduler runner is executed.
 *      '401':
 *        description: Unauthorized
 *        content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponses'
 *      '404':
 *        description: May occur when the workspaceId received does not exist
 *        content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponses'
 *      '500':
 *        description: Internal server error
 *        content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponses'
 *   patch:
 *    tags:
 *      - BMInterop Controller
 *    summary: "Update seat from Building Minds side. As this endpoint is reachable from other internal projects only, required parameters/request body attributes are not verified here."
 *    parameters:
 *      - name: x-req-key
 *        in: header
 *        description: Key sent by the requester to be allowed to reach this endpoint
 *        required: true
 *        schema:
 *          type: string
 *      - name: workspaceId
 *        in: query
 *        description: Unique identifier mapped to the seat in FoW
 *        required: true
 *        schema:
 *          type: string
 *          format: uuid
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            allOf:
 *              - anyOf:
 *                - $ref: "#/components/schemas/AvailableResourcesAsObj"
 *                - $ref: "#/components/schemas/NeighbourhoodIdAsObj"
 *                - $ref: "#/components/schemas/FloorIdAsObj"
 *                - $ref: "#/components/schemas/NameAsObj"
 *                - $ref: "#/components/schemas/BookableAsObj"
 *                - $ref: "#/components/schemas/ValidFromAsObj"
 *                - $ref: "#/components/schemas/ValidUntilAsObj"
 *              - type: object
 *                properties:
 *                  characteristics:
 *                    $ref: "#/components/schemas/CharacteristicsOptional"
 *                  workAreaId:
 *                    $ref: "#/components/schemas/WorkAreaIdOptional"
 *                  spaceId:
 *                    $ref: "#/components/schemas/SpaceIdOptional"
 *                  workspaceCode:
 *                    $ref: "#/components/schemas/WorkspaceCodeOptional"
 *                  type:
 *                    description: Type of workplace
 *                    type: string
 *                  capacity:
 *                    $ref: "#/components/schemas/CapacityOptional"
 *    responses:
 *      '202':
 *        description: Successful operation, seat will be updated when the next scheduler runner is executed.
 *      '401':
 *        description: Unauthorized
 *        content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponses'
 *      '404':
 *        description: May occur when the workspaceId received does not exist
 *        content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponses'
 *      '500':
 *        description: Internal server error
 *        content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponses'
 *   delete:
 *    tags:
 *      - BMInterop Controller
 *    summary: "Deletion of seat. As this endpoint is reachable from other internal projects only, required parameters/request body attributes are not verified here."
 *    parameters:
 *      - name: x-req-key
 *        in: header
 *        description: Key sent by the requester to be allowed to reach this endpoint
 *        required: true
 *        schema:
 *          type: string
 *      - name: workspaceId
 *        in: path
 *        description: Unique identifier mapped to the seat in FoW
 *        required: true
 *        schema:
 *          type: string
 *          format: uuid
 *    responses:
 *      '202':
 *        description: Successful operation, seat will be deleted when the next scheduler runner is executed.
 *      '401':
 *        description: Unauthorized
 *        content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponses'
 *      '404':
 *        description: May occur when the workspaceId received does not exist
 *        content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponses'
 *      '500':
 *        description: Internal server error
 *        content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponses'
 */

router.post('/workspace', async function (req, res, _next) {
  try {
    await workspaceCRUD(req, res, OP_CREATE)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

router.put('/workspace', async function (req, res, _next) {
  try {
    await workspaceCRUD(req, res, OP_UPDATE)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

router.patch('/workspace', async function (req, res, _next) {
  try {
    console.log('Request arriving for workspace event. Operation type: ', OP_UPDATE, ' in PATCH HTTP method.')
    requesterAuthValidation(req)
    if (!(await BMInteropController.isAccessTokenValid(req.headers.authorization)))
      throw new Errors.UnauthorizedError('Invalid access token.')
    const data = req.body
    data.workspaceId = req.query.workspaceId
    data.operation = OP_UPDATE
    await BMInteropController.workSpacesTopicCommon(data, data.operation)
    res.status(ACCEPTED_STATUS_CODE)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

router.delete('/workspace', async function (req, res, _next) {
  try {
    await workspaceCRUD(req, res, OP_DELETE)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/bmInterop/neighbourhood:
 *   post:
 *    tags:
 *      - BMInterop Controller
 *    summary: "Creation of neighbourhood from Building Minds side. As this endpoint is reachable from other internal projects only, required parameters/request body attributes are not verified here."
 *    parameters:
 *      - name: x-req-key
 *        in: header
 *        description: Key sent by the requester to be allowed to reach this endpoint
 *        required: true
 *        schema:
 *          type: string
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/BMInterop-neighbourhood"
 *    responses:
 *      '201':
 *        description: Successful operation, neighbourhood created successfully.
 *      '400':
 *        description: Bad request
 *        content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponses'
 *      '401':
 *        description: Unauthorized
 *        content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponses'
 *      '500':
 *        description: Internal server error
 *        content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponses'
 *   put:
 *    tags:
 *      - BMInterop Controller
 *    summary: "Update of neighbourhood from Building Minds side. As this endpoint is reachable from other internal projects only, required parameters/request body attributes are not verified here."
 *    parameters:
 *      - name: x-req-key
 *        in: header
 *        description: Key sent by the requester to be allowed to reach this endpoint
 *        required: true
 *        schema:
 *          type: string
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/BMInterop-neighbourhood"
 *    responses:
 *      '202':
 *        description: Successful operation, neighbourhood will be updated when the next scheduler runner is executed.
 *      '401':
 *        description: Unauthorized
 *        content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponses'
 *      '404':
 *        description: May occur when the neighbourhoodId received does not exist
 *        content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponses'
 *      '500':
 *        description: Internal server error
 *        content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponses'
 *   patch:
 *    tags:
 *      - BMInterop Controller
 *    summary: "Update of neighbourhood from Building Minds side. As this endpoint is reachable from other internal projects only, required parameters/request body attributes are not verified here."
 *    parameters:
 *      - name: x-req-key
 *        in: header
 *        description: Key sent by the requester to be allowed to reach this endpoint
 *        required: true
 *        schema:
 *          type: string
 *      - name: neighbourhoodId
 *        in: query
 *        description: Unique identifier mapped to the hoods in FoW
 *        required: true
 *        schema:
 *          type: string
 *          format: uuid
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            allOf:
 *              - anyOf:
 *                - $ref: "#/components/schemas/WorkspaceIdsAsObj"
 *                - $ref: "#/components/schemas/TagsAsObj"
 *                - $ref: "#/components/schemas/NameAsObj"
 *              - type: object
 *                properties:
 *                  organisationId:
 *                    $ref: "#/components/schemas/OrganisationIdOptional"
 *                  validFrom:
 *                    $ref: "#/components/schemas/ValidFromOptional"
 *                  validUntil:
 *                    $ref: "#/components/schemas/ValidUntilOptional"
 *                  color:
 *                    $ref: "#/components/schemas/ColorOptional"
 *                  characteristics:
 *                    $ref: "#/components/schemas/CharacteristicsOptional"
 *    responses:
 *      '202':
 *        description: Successful operation, neighbourhood will be updated when the next scheduler runner is executed.
 *      '401':
 *        description: Unauthorized
 *        content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponses'
 *      '404':
 *        description: May occur when the neighbourhoodId received does not exist
 *        content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponses'
 *      '500':
 *        description: Internal server error
 *        content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponses'
 *   delete:
 *    tags:
 *      - BMInterop Controller
 *    summary: "Deletion of neighbourhood from Building Minds side. As this endpoint is reachable from other internal projects only, required parameters/request body attributes are not verified here."
 *    parameters:
 *      - name: x-req-key
 *        in: header
 *        description: Key sent by the requester to be allowed to reach this endpoint
 *        required: true
 *        schema:
 *          type: string
 *      - name: neighbourhoodId
 *        in: path
 *        description: Unique identifier mapped to the hoods in FoW
 *        required: true
 *        schema:
 *          type: string
 *          format: uuid
 *    responses:
 *      '202':
 *        description: Successful operation, neighbourhood will be deleted when the next scheduler runner is executed.
 *      '401':
 *        description: Unauthorized
 *        content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponses'
 *      '404':
 *        description: May occur when the neighbourhoodId received does not exist
 *        content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponses'
 *      '500':
 *        description: Internal server error
 *        content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponses'
 */

router.post('/neighbourhood', async function (req, res, _next) {
  try {
    await neighbourhoodCRUD(req, res, OP_CREATE)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

router.put('/neighbourhood', async function (req, res, _next) {
  try {
    await neighbourhoodCRUD(req, res, OP_UPDATE)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

router.patch('/neighbourhood', async function (req, res, _next) {
  try {
    console.log('Request arriving for neighbourhood event. Operation type: ', OP_UPDATE, ' in PATCH HTTP method.')
    requesterAuthValidation(req)
    if (!(await BMInteropController.isAccessTokenValid(req.headers.authorization)))
      throw new Errors.UnauthorizedError('Invalid access token.')
    const data = req.body
    data.neighbourhoodId = req.query.neighbourhoodId
    data.operation = OP_UPDATE
    const all = await BMInteropController.workSpacesTopicNeighbourhood(data, data.operation)
    res.status(ACCEPTED_STATUS_CODE)
    res.json(all)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

router.delete('/neighbourhood', async function (req, res, _next) {
  try {
    await neighbourhoodCRUD(req, res, OP_DELETE)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/bmInterop/site:
 *   post:
 *    tags:
 *      - BMInterop Controller
 *    summary: "Site creation from Building Minds side. As this endpoint is reachable from other internal projects only, required parameters/request body attributes are not verified here."
 *    parameters:
 *      - name: x-req-key
 *        in: header
 *        description: Key sent by the requester to be allowed to reach this endpoint
 *        required: true
 *        schema:
 *          type: string
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/BMInterop-site"
 *    responses:
 *      '201':
 *        description: Successful operation, site created successfully.
 *      '400':
 *        description: Bad Request
 *        content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponses'
 *      '401':
 *        description: Unauthorized
 *        content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponses'
 *      '500':
 *        description: Internal server error
 *        content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponses'
 *   put:
 *    tags:
 *      - BMInterop Controller
 *    summary: "Site update from Building Minds side. As this endpoint is reachable from other internal projects only, required parameters/request body attributes are not verified here."
 *    parameters:
 *      - name: x-req-key
 *        in: header
 *        description: Key sent by the requester to be allowed to reach this endpoint
 *        required: true
 *        schema:
 *          type: string
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/BMInterop-site"
 *    responses:
 *      '202':
 *        description: Successful operation, site will be updated when the next scheduler runner is executed.
 *      '401':
 *        description: Unauthorized
 *        content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponses'
 *      '404':
 *        description: May occur when the siteId received does not exist
 *        content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponses'
 *      '500':
 *        description: Internal server error
 *        content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponses'
 *   patch:
 *    tags:
 *      - BMInterop Controller
 *    summary: "Site update from Building Minds side. As this endpoint is reachable from other internal projects only, required parameters/request body attributes are not verified here."
 *    parameters:
 *      - name: x-req-key
 *        in: header
 *        description: Key sent by the requester to be allowed to reach this endpoint
 *        required: true
 *        schema:
 *          type: string
 *      - name: siteId
 *        in: query
 *        description: Unique identifier mapped to the sites in FoW
 *        required: true
 *        schema:
 *          type: string
 *          format: uuid
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            allOf:
 *              - anyOf:
 *                - $ref: "#/components/schemas/NameAsObj"
 *                - $ref: "#/components/schemas/ValidFromAsObj"
 *                - $ref: "#/components/schemas/ValidUntilAsObj"
 *              - type: object
 *                properties:
 *                  addressIds:
 *                    $ref: "#/components/schemas/AddressIdsOptional"
 *                  areaMeasurementIds:
 *                    $ref: "#/components/schemas/AreaMeasurementIdsOptional"
 *                  rentalUnitId:
 *                    $ref: "#/components/schemas/RentalUnitIdOptional"
 *                  organisationIds:
 *                    $ref: "#/components/schemas/OrganisationIdsOptional"
 *                  contactIds:
 *                    $ref: "#/components/schemas/ContactIdsOptional"
 *                  buildingIds:
 *                    $ref: "#/components/schemas/BuildingIdsOptional"
 *                  landIds:
 *                    $ref: "#/components/schemas/LandIdsOptional"
 *                  siteCode:
 *                    $ref: "#/components/schemas/SiteCodeOptional"
 *                  type:
 *                    $ref: "#/components/schemas/TypeOptional"
 *                  status:
 *                    $ref: "#/components/schemas/StatusOptional"
 *    responses:
 *      '202':
 *        description: Successful operation, site will be updated when the next scheduler runner is executed.
 *      '401':
 *        description: Unauthorized
 *        content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponses'
 *      '404':
 *        description: May occur when the siteId received does not exist
 *        content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponses'
 *      '500':
 *        description: Internal server error
 *        content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponses'
 *   delete:
 *    tags:
 *      - BMInterop Controller
 *    summary: "Site deletion from Building Minds side. As this endpoint is reachable from other internal projects only, required parameters/request body attributes are not verified here."
 *    parameters:
 *      - name: x-req-key
 *        in: header
 *        description: Key sent by the requester to be allowed to reach this endpoint
 *        required: true
 *        schema:
 *          type: string
 *      - name: siteId
 *        in: path
 *        description: Unique identifier mapped to the sites in FoW
 *        required: true
 *        schema:
 *          type: string
 *          format: uuid
 *    responses:
 *      '202':
 *        description: Successful operation, site will be deleted when the next scheduler runner is executed.
 *      '401':
 *        description: Unauthorized
 *        content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponses'
 *      '404':
 *        description: May occur when the siteId received does not exist
 *        content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponses'
 *      '500':
 *        description: Internal server error
 *        content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponses'
 */

router.post('/site', async function (req, res, _next) {
  try {
    await siteCRUD(req, res, OP_CREATE)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

router.put('/site', async function (req, res, _next) {
  try {
    await siteCRUD(req, res, OP_UPDATE)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

router.patch('/site', async function (req, res, _next) {
  try {
    console.log('Request arriving for site event. Operation type: ', OP_UPDATE, ' in PATCH HTTP method.')
    requesterAuthValidation(req)
    if (!(await BMInteropController.isAccessTokenValid(req.headers.authorization)))
      throw new Errors.UnauthorizedError('Invalid access token.')
    const data = req.body
    data.siteId = req.query.siteId
    data.operation = OP_UPDATE
    await BMInteropController.workspaceSitesTopicSite(data, data.operation)
    res.status(ACCEPTED_STATUS_CODE)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

router.delete('/site', async function (req, res, _next) {
  try {
    await siteCRUD(req, res, OP_DELETE)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/bmInterop/building:
 *   post:
 *    tags:
 *      - BMInterop Controller
 *    summary: "Building creation from Building Minds side. As this endpoint is reachable from other internal projects only, required parameters/request body attributes are not verified here."
 *    parameters:
 *      - name: x-req-key
 *        in: header
 *        description: Key sent by the requester to be allowed to reach this endpoint
 *        required: true
 *        schema:
 *          type: string
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/BMInterop-building"
 *    responses:
 *      '201':
 *        description: Successful operation, building created successfully.
 *      '400':
 *        description: Bad Request
 *        content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponses'
 *      '401':
 *        description: Unauthorized
 *        content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponses'
 *      '500':
 *        description: Internal server error
 *        content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponses'
 *   put:
 *    tags:
 *      - BMInterop Controller
 *    summary: "Building update from Building Minds side. As this endpoint is reachable from other internal projects only, required parameters/request body attributes are not verified here."
 *    parameters:
 *      - name: x-req-key
 *        in: header
 *        description: Key sent by the requester to be allowed to reach this endpoint
 *        required: true
 *        schema:
 *          type: string
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/BMInterop-building"
 *    responses:
 *      '202':
 *        description: Successful operation, building will be updated when the next scheduler runner is executed.
 *      '401':
 *        description: Unauthorized
 *        content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponses'
 *      '404':
 *        description: May occur when the buildingId received does not exist
 *        content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponses'
 *      '500':
 *        description: Internal server error
 *        content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponses'
 *   patch:
 *    tags:
 *      - BMInterop Controller
 *    summary: "Building update from Building Minds side. As this endpoint is reachable from other internal projects only, required parameters/request body attributes are not verified here."
 *    parameters:
 *      - name: x-req-key
 *        in: header
 *        description: Key sent by the requester to be allowed to reach this endpoint
 *        required: true
 *        schema:
 *          type: string
 *      - name: buildingId
 *        in: query
 *        description: Unique identifier mapped to the building in FoW
 *        required: true
 *        schema:
 *          type: string
 *          format: uuid
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            allOf:
 *              - anyOf:
 *                - $ref: "#/components/schemas/SiteIdAsObj"
 *                - $ref: "#/components/schemas/NameAsObj"
 *                - $ref: "#/components/schemas/ValidFromAsObj"
 *                - $ref: "#/components/schemas/ValidUntilAsobj"
 *              - type: object
 *                properties:
 *                  addressIds:
 *                    $ref: "#/components/schemas/AddressIdsOptional"
 *                  areaMeasurementIds:
 *                    $ref: "#/components/schemas/AreaMeasurementIdsOptional"
 *                  rentalUnitId:
 *                    $ref: "#/components/schemas/RentalUnitIdOptional"
 *                  organisationIds:
 *                    $ref: "#/components/schemas/OrganisationIdsOptional"
 *                  contactIds:
 *                    $ref: "#/components/schemas/ContactIdsOptional"
 *                  floorIds:
 *                    $ref: "#/components/schemas/FloorIdsOptional"
 *                  buildingCode:
 *                    $ref: "#/components/schemas/BuildingCodeOptional"
 *                  primaryTypeOfBuilding:
 *                    $ref: "#/components/schemas/PrimaryTypeOfBuildingOptional"
 *                  secondaryTypeOfBuilding:
 *                    $ref: "#/components/schemas/SecondaryTypeOfBuildingOptional"
 *                  energyEfficiencyClass:
 *                    $ref: "#/components/schemas/EnergyEfficiencyClassOptional"
 *                  constructionYear:
 *                    $ref: "#/components/schemas/ConstructionYearOptional"
 *                  yearOfLastRefurbishment:
 *                    $ref: "#/components/schemas/YearOfLastRefurbishmentOptional"
 *                  monumentProtection:
 *                    $ref: "#/components/schemas/MonumentProtectionOptional"
 *                  typeOfOwnership:
 *                    $ref: "#/components/schemas/TypeOfOwnershipOptional"
 *                  selfUse:
 *                    $ref: "#/components/schemas/SelfUseOptional"
 *                  tenantStructure:
 *                    $ref: "#/components/schemas/TenantStructureOptional"
 *                  parkingSpaces:
 *                    $ref: "#/components/schemas/ParkingSpacesOptional"
 *                  electricVehicleChargingStations:
 *                    $ref: "#/components/schemas/ElectricVehicleChargingStationsOptional"
 *                  primaryEnergyType:
 *                    $ref: "#/components/schemas/PrimaryEnergyTypeOptional"
 *                  primaryWaterType:
 *                    $ref: "#/components/schemas/PrimaryWaterTypeOptional"
 *                  primaryHeatingType:
 *                    $ref: "#/components/schemas/PrimaryHeatingTypeOptional"
 *                  secondaryHeatingType:
 *                    $ref: "#/components/schemas/SecondaryHeatingTypeOptional"
 *                  airConditioning:
 *                    $ref: "#/components/schemas/AirConditioningOptional"
 *                  status:
 *                    $ref: "#/components/schemas/StatusOptional"
 *                  numberOfEmployees:
 *                    $ref: "#/components/schemas/NumberOfEmployeesOptional"
 *    responses:
 *      '202':
 *        description: Successful operation, building will be updated when the next scheduler runner is executed.
 *      '401':
 *        description: Unauthorized
 *        content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponses'
 *      '404':
 *        description: May occur when the buildingId received does not exist
 *        content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponses'
 *      '500':
 *        description: Internal server error
 *        content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponses'
 *   delete:
 *    tags:
 *      - BMInterop Controller
 *    summary: "Building creation from Building Minds side. As this endpoint is reachable from other internal projects only, required parameters/request body attributes are not verified here."
 *    parameters:
 *      - name: x-req-key
 *        in: header
 *        description: Key sent by the requester to be allowed to reach this endpoint
 *        required: true
 *        schema:
 *          type: string
 *      - name: buildingId
 *        in: path
 *        description: Unique identifier mapped to the building in FoW
 *        required: true
 *        schema:
 *          type: string
 *          format: uuid
 *    responses:
 *      '202':
 *        description: Successful operation, building will be deleted when the next scheduler runner is executed.
 *      '401':
 *        description: Unauthorized
 *        content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponses'
 *      '404':
 *        description: May occur when the buildingId received does not exist
 *        content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponses'
 *      '500':
 *        description: Internal server error
 *        content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponses'
 */

router.post('/building', async function (req, res, _next) {
  try {
    await buildingCRUD(req, res, OP_CREATE)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

router.put('/building', async function (req, res, _next) {
  try {
    await buildingCRUD(req, res, OP_UPDATE)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

router.patch('/building', async function (req, res, _next) {
  try {
    console.log('Request arriving for building event. Operation type: ', OP_UPDATE, ' in PATCH HTTP method.')
    requesterAuthValidation(req)
    if (!(await BMInteropController.isAccessTokenValid(req.headers.authorization)))
      throw new Errors.UnauthorizedError('Invalid access token.')
    const data = req.body
    data.buildingId = req.query.buildingId
    data.operation = OP_UPDATE
    await BMInteropController.workspaceSitesTopicBuilding(data, data.operation)
    res.status(ACCEPTED_STATUS_CODE)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

router.delete('/building', async function (req, res, _next) {
  try {
    await buildingCRUD(req, res, OP_DELETE)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/bmInterop/floor:
 *   post:
 *    tags:
 *      - BMInterop Controller
 *    summary: "Floor creation from Building Minds side. As this endpoint is reachable from other internal projects only, required parameters/request body attributes are not verified here."
 *    parameters:
 *      - name: x-req-key
 *        in: header
 *        description: Key sent by the requester to be allowed to reach this endpoint
 *        required: true
 *        schema:
 *          type: string
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/BMInterop-floor"
 *    responses:
 *      '201':
 *        description: Successful operation, floor created successfully.
 *      '400':
 *        description: Bad Request
 *        content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponses'
 *      '401':
 *        description: Unauthorized
 *        content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponses'
 *      '500':
 *        description: Internal server error
 *        content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponses'
 *   put:
 *    tags:
 *      - BMInterop Controller
 *    summary: "Floor update from Building Minds side. As this endpoint is reachable from other internal projects only, required parameters/request body attributes are not verified here."
 *    parameters:
 *      - name: x-req-key
 *        in: header
 *        description: Key sent by the requester to be allowed to reach this endpoint
 *        required: true
 *        schema:
 *          type: string
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/BMInterop-floor"
 *    responses:
 *      '202':
 *        description: Successful operation, floor will be updated when the next scheduler runner is executed.
 *      '401':
 *        description: Unauthorized
 *        content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponses'
 *      '404':
 *        description: May occur when the floorId received does not exist
 *        content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponses'
 *      '500':
 *        description: Internal server error
 *        content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponses'
 *   patch:
 *    tags:
 *      - BMInterop Controller
 *    summary: "Floor update from Building Minds side. As this endpoint is reachable from other internal projects only, required parameters/request body attributes are not verified here."
 *    parameters:
 *      - name: x-req-key
 *        in: header
 *        description: Key sent by the requester to be allowed to reach this endpoint
 *        required: true
 *        schema:
 *          type: string
 *      - name: floorId
 *        in: query
 *        description: Unique identifier mapped to the floor in FoW
 *        required: true
 *        schema:
 *          type: string
 *          format: uuid
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            allOf:
 *              - anyOf:
 *                - $ref: "#/components/schemas/BuildingIdAsObj"
 *                - $ref: "#/components/schemas/NameAsObj"
 *                - $ref: "#/components/schemas/ValidFromAsObj"
 *                - $ref: "#/components/schemas/ValidUntilAsObj"
 *              - type: object
 *                properties:
 *                  spaceIds:
 *                    $ref: "#/components/schemas/SpaceIdsOptional"
 *                  areaMeasurementIds:
 *                    $ref: "#/components/schemas/AreaMeasurementIdsOptional"
 *                  floorCode:
 *                    $ref: "#/components/schemas/FloorCodeOptional"
 *                  floorNumber:
 *                    $ref: "#/components/schemas/FloorNumberOptional"
 *    responses:
 *      '202':
 *        description: Successful operation, floor will be updated when the next scheduler runner is executed.
 *      '401':
 *        description: Unauthorized
 *        content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponses'
 *      '404':
 *        description: May occur when the floorId received does not exist
 *        content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponses'
 *      '500':
 *        description: Internal server error
 *        content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponses'
 *   delete:
 *    tags:
 *      - BMInterop Controller
 *    summary: "Floor deletion from Building Minds side. As this endpoint is reachable from other internal projects only, required parameters/request body attributes are not verified here."
 *    parameters:
 *      - name: x-req-key
 *        in: header
 *        description: Key sent by the requester to be allowed to reach this endpoint
 *        required: true
 *        schema:
 *          type: string
 *      - name: floorId
 *        in: path
 *        description: Unique identifier mapped to the floor in FoW
 *        required: true
 *        schema:
 *          type: string
 *          format: uuid
 *    responses:
 *      '202':
 *        description: Successful operation, floor will be deleted when the next scheduler runner is executed.
 *      '401':
 *        description: Unauthorized
 *        content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponses'
 *      '404':
 *        description: May occur when the floorId received does not exist
 *        content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponses'
 *      '500':
 *        description: Internal server error
 *        content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponses'
 */

router.post('/floor', async function (req, res, _next) {
  try {
    await floorCRUD(req, res, OP_CREATE)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

router.put('/floor', async function (req, res, _next) {
  try {
    await floorCRUD(req, res, OP_UPDATE)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

router.patch('/floor', async function (req, res, _next) {
  try {
    console.log('Request arriving for floor event. Operation type: ', OP_UPDATE, ' in PATCH HTTP method.')
    requesterAuthValidation(req)
    if (!(await BMInteropController.isAccessTokenValid(req.headers.authorization)))
      throw new Errors.UnauthorizedError('Invalid access token.')
    const data = req.body
    data.floorId = req.query.floorId
    data.operation = OP_UPDATE
    await BMInteropController.workspaceSitesTopicFloor(data, data.operation)
    res.status(ACCEPTED_STATUS_CODE)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

router.delete('/floor', async function (req, res, _next) {
  try {
    await floorCRUD(req, res, OP_DELETE)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

/**
 * @swagger
 * /api/bmInterop/:
 *   post:
 *     tags:
 *       - BMInterop Controller
 *     summary: "Tests FoW connectivity with CPI"
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               auth:
 *                 description: Client credentials parameters. Client id and client secret passed as basic auth
 *                 type: string
 *                 example: Basic asdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfads
 *     responses:
 *       '200':
 *         description: Connectivity success (or not)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 firstReqSuccess:
 *                   description: Describes if the first request sent to CPI from the middleware (the one that obtains the access token to be sent in the second request) is successful
 *                   type: boolean
 *                secondReqStatus:
 *                  description: Status code of the second request (reaching the CPI test endpoint)
 *                  type: integer
 *                secondReqStatusText:
 *                  description: Message returned by the second endpoint request
 *                  type: string
 *
 */
router.post('/', async function (req, res, _next) {
  try {
    const all = await BMInteropController.foWCPIConnectivityTest(req.body)
    res.json(all)
  } catch (e) {
    apiActionResponses(e)(res, e.message)
  }
})

async function workspaceLayoutCRUD(req, res, opType) {
  console.log('Request arriving for workspace layout event. Operation type: ', opType)
  requesterAuthValidation(req)
  const data = req.body
  if (opType === OP_DELETE) data.floorId = req.params.floorId
  data.operation = opType
  await BMInteropController.workSpaceLayoutTopic(data, data.operation)
  res.status(ACCEPTED_STATUS_CODE).send()
}

async function workspaceCRUD(req, res, opType) {
  console.log('Request arriving for workspace event. Operation type: ', opType)
  requesterAuthValidation(req)
  const data = req.body
  if (opType === OP_DELETE) data.workspaceId = req.headers.workspaceid
  data.operation = opType
  const all = await BMInteropController.workSpacesTopicCommon(data, data.operation)
  res.status(opType === OP_CREATE ? CREATED_STATUS_CODE : ACCEPTED_STATUS_CODE)
  res.json(all)
}

async function neighbourhoodCRUD(req, res, opType) {
  console.log('Request arriving for neighbourhood event. Operation type: ', opType)
  requesterAuthValidation(req)
  const data = req.body
  if (opType === OP_DELETE) data.neighbourhoodId = req.headers.neighbourhoodid
  data.operation = opType
  const all = await BMInteropController.workSpacesTopicNeighbourhood(data, data.operation)
  res.status(opType === OP_CREATE ? CREATED_STATUS_CODE : ACCEPTED_STATUS_CODE)
  res.json(all)
}

async function siteCRUD(req, res, opType) {
  console.log('Request arriving for site event. Operation type: ', opType)
  requesterAuthValidation(req)
  const data = req.body
  if (opType === OP_DELETE) data.siteId = req.headers.siteid
  data.operation = opType
  const all = await BMInteropController.workspaceSitesTopicSite(data, data.operation)
  res.status(opType === OP_CREATE ? CREATED_STATUS_CODE : ACCEPTED_STATUS_CODE)
  res.json(all)
}

async function buildingCRUD(req, res, opType) {
  console.log('Request arriving for building event. Operation type: ', opType)
  requesterAuthValidation(req)
  const data = req.body
  if (opType === OP_DELETE) data.buildingId = req.headers.buildingid
  data.operation = opType
  const all = await BMInteropController.workspaceSitesTopicBuilding(data, data.operation)
  res.status(opType === OP_CREATE ? CREATED_STATUS_CODE : ACCEPTED_STATUS_CODE)
  res.json(all)
}

async function floorCRUD(req, res, opType) {
  console.log('Request arriving for floor event. Operation type: ', opType)
  requesterAuthValidation(req)
  const data = req.body
  if (opType === OP_DELETE) data.floorId = req.headers.floorid
  data.operation = opType
  const all = await BMInteropController.workspaceSitesTopicFloor(data, data.operation)
  res.status(opType === OP_CREATE ? CREATED_STATUS_CODE : ACCEPTED_STATUS_CODE)
  res.json(all)
}

function requesterAuthValidation(req) {
  if (!req.headers[REQ_AUTH_HEADER]) {
    console.error(REQ_AUTH_HEADER, ' header is missing')
    throw new Errors.BadRequestError(REQ_AUTH_HEADER + ' header is missing')
  }
  if (!AuthController.isRequesterAuthorized(req.headers[REQ_AUTH_HEADER])) {
    console.error(
      'Requester not allowed to make requests to BMInterop endpoints. ',
      REQ_AUTH_HEADER,
      ' header value arriving: ',
      req.headers[REQ_AUTH_HEADER]
    )
    throw new Errors.UnauthorizedError('Requester not allowed to make requests to BMInterop endpoints.')
  }
}
