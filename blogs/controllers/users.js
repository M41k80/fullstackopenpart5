const express = require('express')
const bcrypt = require('bcrypt')
const { generateToken } = require('../utils/jwt')
const { userExtractor } = require('../utils/jwt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  try{
    const users = await User.find({}).populate('blogs', { title:1, author:1, url:1, likes: 1})
  response.json(users)
  } catch (error) {
    response.status(500).json({ error: error.message })
  }
})

usersRouter.post('/', async (request, response) => {
    if (process.env.NODE_ENV === 'test') {
    const { username, password, name } = request.body

    // const { username, password, name } = request.body


    const existingUser = await User.findOne({ username })
    if (existingUser) {
        return response.status(400).json({ error: 'username must be unique' })
    }

    if (!username || !password || !name) {
        return response.status(400).json({ error: 'username, password and name must be provided' })
    }

    if (!username || !password) {
        return response.status(400).json({ error: 'username and password must be provided' })
    }

    if (username.length < 3 || password.length < 3) {
        return response.status(400).json({ error: 'username must be between 3 and 3 characters' })
    }

    const userExists = await User.findOne({ username })
    if (userExists) {
        return response.status(400).json({ error: 'username must be unique' })
    } 

    


    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        username,
        passwordHash,
        name,
        
    })
    try {
      const savedUser = await user.save()
      const token = generateToken(savedUser)
      
      response.status(201).json({
        token, 
        username: savedUser.username, 
        name: savedUser.name
      })
      } catch (error) {
        response.status(400).json({ error: 'failed to create user' })
    }
  } else {
    const { username, password, name } = request.body

    const existingUser = await User.findOne({ username })
    if (existingUser) {
      return response.status(400).json({ error: 'username must be unique' })
    }

    if (!username || !password || !name) {
      return response.status(400).json({ error: 'username, password and name must be provided' })
    }

    if (username.length < 3 || password.length < 3) {
      return response.status(400).json({ error: 'username must be between 3 and 3 characters' })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
      username,
      passwordHash,
      name,
    })

    try {
      const savedUser = await user.save()
      const token = generateToken(savedUser)

      response.status(201).json({
        token,
        username: savedUser.username,
        name: savedUser.name,
      })
    } catch (error) {
      response.status(400).json({ error: 'failed to create user' })
    }
  }
})

module.exports = usersRouter