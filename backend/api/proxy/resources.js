const { Router } = require('express')
const axios = require('axios')
const router = Router()

module.exports = router

router.get('/image/:username(\\w+)', (req, res) => {
  const username = req.params.username

  axios
    .get(`https://app.roqs.basf.net/user_picture_api/image/${username}` , { responseType: 'stream' })
    .then((r) => {
      r.data.pipe(res)
    })
    .catch((e) => res.status(500).send(e))

})

router.use('/style/', async (req, res) => {
  const method = req.method
  console.log('Request ', method, req.url)
  if (req.url) {
    const url = `https://app.roqs.basf.net/style${req.url}`
    console.log('Target: ', url)
    const resource = await axios.request({ url, method, responseType: 'stream' })
    res.set(getHeaders(resource))
    resource.data.pipe(res)
  } else {
    res.sendStatus(404)
  }
})

// https://app-dev.roqs.basf.net/style/green.semantic.min.css
// https://app-dev.roqs.basf.net/style/semantic.min.js
// https://app-dev.roqs.basf.net/style/navbar.js

// https://app.roqs.basf.net/style/navbar.js
// https://app.roqs.basf.net/style/dist/semantic.min.js
// https://app.roqs.basf.net/style/dist/green.semantic.min.css

function getHeaders(response) {
  const result = {}
  const needed = ['content-type', 'content-length', 'last-modified', 'etag']
  needed.forEach((h) => {
    result[h] = response.headers[h]
  })
  return result
}
