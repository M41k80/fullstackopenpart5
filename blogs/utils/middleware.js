// const logger = require('./logger')

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
  }
  
  const errorHandler = (error, req, res, next) => {
    console.error(error.message)
    if (error.name === 'CastError') {
      return res.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message })
    } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
      return res.status(400).send({ error: 'expected `username` to be unique' })
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).send({ error: 'invalid token' })
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).send({ error: 'token expired' })
    }
    next(error)
  };
  
module.exports = {
    unknownEndpoint,
    errorHandler,
  }
  