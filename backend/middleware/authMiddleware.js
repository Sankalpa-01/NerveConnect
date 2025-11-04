const jwt = require('jsonwebtoken')

function authMiddleware(req, res, next) {
  try {
  // Token can be in Authorization header or cookie named 'token' or 'auth_token'
    const authHeader = req.headers.authorization || ''
    let token = null
    if (authHeader.startsWith('Bearer ')) token = authHeader.split(' ')[1]
  if (!token && req.cookies) token = req.cookies.token || req.cookies.auth_token

    if (!token) return res.status(401).json({ error: 'Unauthenticated' })

    const secret = process.env.JWT_SECRET
    if (!secret) return res.status(500).json({ error: 'JWT_SECRET not configured' })

    const payload = jwt.verify(token, secret)
    req.user = { id: payload.id, username: payload.username, email: payload.email }
    next()
  } catch (err) {
    console.error('Auth error:', err.message || err)
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}

module.exports = authMiddleware
