const _ = require('lodash')
const dummy = (blogs) => {
    return 1
  }

const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0)
  }

const favortiteBlogs = (blogs) => {
    if (blogs.length === 0) return null

    return blogs.reduce((favorite, blog) => {
        return (favorite.likes > blog.likes) ? favorite : blog
    })
    }

const mostBlogs = (blogs) => {
    if (blogs.length === 0) {
        return null
    }

    const authorCounts = _.countBy(blogs, 'author')


    const mostBlogsAuthor = _.maxBy(Object.keys(authorCounts), (author) => authorCounts[author])

    return {
        author: mostBlogsAuthor,
        blogs: authorCounts[mostBlogsAuthor]
    }
}

const mostLikes = (blogs) => {
    if (blogs.length === 0) {
        return null
    }

    const likesByAuthor = _.reduce(blogs, (sum, blog) => {
        sum[blog.author] = (sum[blog.author] || 0) + blog.likes
        return sum
    }, {})

    const mostLikesAuthor = _.maxBy(Object.keys(likesByAuthor), (author) => likesByAuthor[author])

    return {
        author: mostLikesAuthor,
        likes: likesByAuthor[mostLikesAuthor]
    }
}




    module.exports = {
        dummy,
        totalLikes,
        favortiteBlogs,
        mostBlogs,
        mostLikes
      }


    // const authorCount = {}
      
        
    // blogs.forEach(blog => {
    //     authorCount[blog.author] = (authorCount[blog.author] || 0) + 1
    // })
      
        
    // let maxBlogs = 0;
    // let authorWithMostBlogs = null;
      
    // for (const author in authorCount) {
    //     if (authorCount[author] > maxBlogs) {
    //     maxBlogs = authorCount[author];
    //     authorWithMostBlogs = author;
    //     }
    // }
      
        
    // return {
    //     author: authorWithMostBlogs,
    //     blogs: maxBlogs,
    // }

      


  
  
  