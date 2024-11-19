const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const { authenticate } = require('../utils/auth')
const { userExtractor } = require('../utils/jwt')

blogsRouter.get('/',userExtractor, async (request, response) => {
  try{
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1})

    const blogsWithCreatorId = blogs.map(blog => ({
      ...blog.toObject(),
      creatorId: blog.user._id.toString(),
    }))
  response.json(blogsWithCreatorId)
  } catch (error) {
    response.status(500).json({ error: error.message })
  }
  

})


blogsRouter.post('/', userExtractor, authenticate, async (request, response) => {
  const { title, author, url, likes } = request.body

  

  if (!title || !url) {
    return response.status(400).json({ error: 'title and url must be provided' })
  }

 


  try {
    
    const decodedToken = request.user
    console.log('decodedToken', decodedToken)

    if (!decodedToken.id) {
      return response.status(401).json({ error: 'invalid token' })
    }

  

  const user = await User.findById(decodedToken.id)

  console.log('user', user)


  

  const blog = new Blog({
    title,
    author,
    url,
    likes: likes !== undefined ? likes : 0,
    user: user._id,
  })

  
    const savedBlog = await blog.save()
    
    user.blogs.push(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog)
  } catch (error) {
    console.log('error creating blog', error.message)
    response.status(400).json({ error: 'internal server error' })
  }

})



blogsRouter.delete('/:id', userExtractor, authenticate,async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id)

    if (!blog) {
      return response.status(404).json({ error: 'blog not found' })
    }

    if (blog.user.toString() !== request.user.id.toString()) {
      return response.status(401).json({ error: 'unauthorized' })
    }

    await Blog.findByIdAndDelete(request.params.id).then(result => {
      response.status(204).end()
    })
  } catch (error) {
    response.status(500).json({ error: error.message })
  }
})


blogsRouter.put('/:id', async (request, response, next) => {
  const { title, author, url, likes, user } = request.body

  if (!title || !author || !url || likes === undefined || !user) {
    return response.status(400).json({ error: 'missing required fields' })
  }

  try {
    const updateBlog = {
      title,
      author,
      url,
      likes,
      user,
    }
    const blog = await Blog.findByIdAndUpdate(request.params.id, updateBlog, { new: true})
    if (!blog) {
      return response.status(404).json({ error: 'blog not found' })
    }
    response.json(blog)
    } catch (error) {
      console.log('error updating blog', error)
      response.status(500).json({ error: 'internal server error' })
    }
    
  })


module.exports = blogsRouter
