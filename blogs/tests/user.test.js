const assert = require('node:assert')
const bcrypt = require('bcrypt')
const { test, describe, before, after, beforeEach } = require('node:test')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const mongoose = require('mongoose')

const api = supertest(app)


before(async () => {
    await User.deleteMany({})
})

beforeEach(async () => {
    await User.deleteMany({})
})

test('create a user with valid data', async () => {
    const newUser = {
        username: 'testuser',
        password: 'mytestpassword',
        name: 'Test User',
        
      }

      const response = await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

        const usersAtEnd = await User.find({})
        assert.equal(usersAtEnd.length, 1, 'just one user into the db')
        assert.equal(response.body.username, newUser.username, 'username should be the testuser')

})

test('responds with 400 bad request when username or password are not provided', async () => {
    const newUser = {
        password: 'mytestpassword',
      }

      const response = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
    

        assert.equal(response.body.error, 'username and password must be provided')

    const newUser2 = {
        username: 'testuser',
      }

      const response2 = await api
        .post('/api/users')
        .send(newUser2)
        .expect(400)

        assert.equal(response2.body.error, 'username and password must be provided')

})

test('responds with 400 bad request when username is not between 3 and 3 characters', async () => {
    const newUser = {
        username: 'ok',
        password: 'mytestpassword',
      }
      const response = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)

        assert.equal(response.body.error, 'username must be between 3 and 3 characters')

        const newUser2 = {
            username: 'testuser',
            password: 'ok',
        }

          const response2 = await api
            .post('/api/users')
            .send(newUser2)
            .expect(400)

            assert.equal(response2.body.error, 'username must be between 3 and 3 characters')
})

test('return error when username is in use', async () => {
    const userExists = new User({
        username: 'testuser',
        passwordHash: await bcrypt.hash('existingpassword', 10),
    })

    await userExists.save()

    const newUser = {
        username: 'testuser',
        password: 'mynewtestpassword',
      }
      const response = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)

        assert.equal(response.body.error, 'username must be unique')
})


after(async () => {
    await mongoose.connection.close()
})

