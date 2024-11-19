const jwt = require('jsonwebtoken')

const secretKey = process.env.SECRET || 'mysecret'

const user = {
    username: 'testuser5',
    id: "5a422aa71b54a676234d17f5a",
}

const token = jwt.sign(user, secretKey, { expiresIn: '1h' })
console.log('token:', token)