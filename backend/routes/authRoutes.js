const express = require('express')
const router = express.Router()
const { signup, signin, logout } = require('../controllers/auth')

router.post('/signup', signup)
router.post('/signin', signin)
router.post('/logout', logout)

// current user (protected)
const auth = require('../middleware/authMiddleware')
const { currentUser } = require('../controllers/auth')
router.get('/current', auth, currentUser)

// parse transcript (unprotected)
const { parseTranscript } = require('../controllers/parse')
router.post('/parse', parseTranscript)

module.exports = router
