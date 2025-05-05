const { managedSites, adminSites, isSuperAdmin } = require('../../controllers/AuthController')
const { AppStoreAuth, Gitlab } = require('basf-gtu-utils/client')
const { UNAUTHORIZED_STATUS_CODE } = require('../../common/Utils')

const isDev = process.env.NODE_ENV === 'development'
const AUTHORIZATION_PREFIX = 'Bearer '

async function msProxyUsername(msHeader) {
  return msHeader ? msHeader.split('@')[0].toLowerCase() : null
}

async function authenticate(req, res, next) {
  try {
    const tokenString = req.get('Authorization')
    const gitTokenHeader = req.get('X-Gitlab-Token')
    const msUserHeader = req.get('x-ms-proxy-userprincipalname')
    // check validity of the token
    req.username = await getUserName(tokenString, gitTokenHeader, msUserHeader)
    if (req && req.username) {
      req.username = req.username.toLowerCase()
    }
    if (!req.username) {
      res.status(UNAUTHORIZED_STATUS_CODE).send('Unauthorized')
      console.error('Unauthorized', 'token:', tokenString, 'git:', gitTokenHeader, 'ms:', msUserHeader)
    } else {
      next()
    }
  } catch (e) {
    res.status(UNAUTHORIZED_STATUS_CODE).send(e.message)
    console.error(e)
  }
}

async function authorize(req, _res, next) {
  const [m, a, sa] = await Promise.all([
    managedSites(req.username),
    adminSites(req.username),
    isSuperAdmin(req.username),
  ])
  req.isManager = m.length > 0
  req.isAdmin = a.length > 0
  req.managedSites = m
  req.isSuperAdmin = sa
  req.adminSites = a
  next()
}

async function authenticateClientCredentials(_req, _res, next) {
  next()
}

async function authorizeClientCredentials(req, _res, next) {
  try {
    req.isManager = false
    req.isAdmin = false
    req.managedSites = []
    req.isSuperAdmin = []
    req.adminSites = []
    next()
  } catch (e) {
    console.log(e)
  }
}

async function getUserName(tokenString, gitTokenHeader, msUserHeader) {
  // check validity of the token
  if (isDev && !gitTokenHeader) {
    try {
      return 'userdev'
    } catch (e) {
      console.log(
        'Could not authenticate. You may be missing env variables either at frontend or backend configuration'
      )
      return
    }
  }
  if (tokenString && tokenString.startsWith(AUTHORIZATION_PREFIX)) {
    const token = tokenString.replace(AUTHORIZATION_PREFIX, '')
    return (await AppStoreAuth.token2Info(token)).user_id.toLowerCase()
  }
  if (gitTokenHeader) {
    return (await Gitlab.gitToken(gitTokenHeader)).username.toLowerCase()
  }
  if (msUserHeader) {
    return msProxyUsername(msUserHeader)
  }
  return null
}

module.exports = {
  enticate: authenticate,
  orize: authorize,
  enticateClientCredentials: authenticateClientCredentials,
  orizeClientCredentials: authorizeClientCredentials,
}
