require('dotenv').config()
const express = require('express')

// const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const { userExtractor } = require('./utils/jwt')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const testingRouter = require('./controllers/testing')
const {authenticate} = require('./utils/auth')

const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')


const app = express()

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })

app.use(cors());
app.use(express.json())
// app.use(userExtractor)



app.use('/api/blogs',userExtractor,authenticate, blogsRouter)
app.use('/api/users' ,usersRouter)
app.use('/api/login', loginRouter)

if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app


