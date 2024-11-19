const express = require('express')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const { generateToken } = require('../utils/jwt')
const loginRouter = require('express').Router()

loginRouter.post('/', async (request, response) => {
    const { username, password } = request.body

    console.log('trying to login with username', username)

    const user = await User.findOne({ username })

    if (!user) {
        console.log('user not found')
        return response.status(401).json({ error: 'username or password is invalid' })
    }

    const passwordsMatch = await bcrypt.compare(password, user.passwordHash)
    if (!passwordsMatch) {
        console.log('passwords do not match')
        return response.status(401).json({ error: 'username or password is invalid' })
    }

    const token = generateToken(user)
    console.log('Generated token:', token)

    response.status(200).json({ token, username: user.username, name: user.name })
})

module.exports = loginRouter