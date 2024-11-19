const jwt = require('jsonwebtoken')
const User = require('../models/user')

const secretKey = process.env.SECRET || 'mysecret'



const userExtractor = async(request, response, next) => {
    const authorization = request.get('authorization')

    if ( !authorization  || !authorization.startsWith('Bearer ')) {
        return response.status(401).json({ error: 'no token provided' })
    }
    const token = authorization.substring(7)

    try {
        const decodedToken = jwt.verify(token, secretKey)

        if (!decodedToken.id) {
            return response.status(401).json({ error: 'invalid token' })
        }

        const user = await User.findById(decodedToken.id)

        if (!user) {
            return response.status(401).json({ error: 'user not found' })
        }

        request.user = user
        next()

    } catch (error) {
        response.status(401).json({ error: 'invalid token' })

    }

}

const generateToken = (user) => {
    const userForToken = {
        username: user.username,
        id: user._id,
    }
    return jwt.sign(userForToken, secretKey, { expiresIn: '1h' })
}

const verifyToken = (token) => {
    return jwt.verify(token, process.env.SECRET)
    
}


module.exports = {
    generateToken,
    verifyToken,
    userExtractor,
}