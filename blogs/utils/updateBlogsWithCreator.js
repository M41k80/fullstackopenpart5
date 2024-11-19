require('dotenv').config()

const mongoose = require('mongoose')
const Blog = require('../models/blog')
const User = require('../models/user')

const updatedBlogWithCreator = async () => {
    try {
        const uri = process.env.MONGODB_URI

        if (!uri) {
            console.log('MONGODB_URI not found')
            return
        }

        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log('connected to db')

        const user = await User.findOne()

        if (!user) {
            console.log('user not found')
            return 
        }

        if ( !user.name ) {
            user.name = 'Anonymous'
            await user.save()
        }

        const blogs = await Blog.find({ user: {$exists: false } })

        if (blogs.length === 0) {
            console.log('no blogs with no user')
            return
        }

        for (const blog of blogs) {
            blog.user = user._id
            await blog.save()

            user.blogs.push(blog._id)
            await user.save()
        }
        console.log('blogs updated')
        mongoose.connection.close()

    } catch (error) {
        console.log('error updating blogs', error.message)
    }
}

updatedBlogWithCreator()