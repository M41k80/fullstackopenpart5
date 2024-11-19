const jwt = require('jsonwebtoken')
const { verifyToken } = require('./jwt')


const secretKey = process.env.SECRET

const generateToken = (user) => {
    return jwt.sign({ id: user.id, username: user.username }, secretKey, { expiresIn: '1h' })
}

const authenticate = (request, response, next) => {

    if (process.env.NODE_ENV === 'test') {
        return next()
    }

    const authorization = request.get('authorization')

    console.log('Authorization header', authorization)

    if ( !authorization  || !authorization.startsWith('Bearer ')) {
        return response.status(401).json({ error: 'no token provided' })
    }

    const token = authorization.substring(7)
    try {
        const Tokendecoded = verifyToken(token)
        request.user = Tokendecoded
        next()
    } catch (error) {
        response.status(401).json({ error: 'invalid token' })
    }
}

module.exports = {authenticate, generateToken}