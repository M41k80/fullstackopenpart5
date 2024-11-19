import { useState } from "react"
import blogService from "../services/blogs"
import PropTypes from 'prop-types'


const Blog = ({ blog, updateBlogs, handleDeleteBlog, handleLike, user }) => {
  const [likes, setLikes] = useState(blog.likes)
  const [showDetails, setShowDetails] = useState(false)


  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const detailStyle = {
    marginTop: 10,
    paddingLeft: 5,
    backgroundColor: '#e9e9e9',
    borderRadius: '5px',
    padding: '5px'
  }

  const handleToggleDetails = () => {
    setShowDetails(!showDetails)
  }

  const handleLikeclick = async () => {
    const updateBlog = {
      ...blog,
      likes: blog.likes + 1
    }
   

    try {
      const response = await blogService.update(blog.id ,updateBlog)
      setLikes(likes + 1)
      handleLike(blog.id)
      updateBlogs()
      console.log('Blog updated:', response)
    }catch (error) {
      console.error('Error updating likes:', error)
  }
  }

  const canDelete = user && blog.author === user.username

  return (
    <div style={blogStyle} className="blog">
      <div className="blog-header">
        <p className="blog-title">{blog.title} by </p>
        <p className="blog-author">{blog.author}</p>
        <button onClick={handleToggleDetails} className="view-details">
          {showDetails ? 'hide' : 'view'} details
        </button>
      </div>
      {showDetails && (
        <div style={detailStyle} className="blog-details">
          <p className="blog-url">{blog.url}</p>
          <p className="blog-likes">Likes: {blog.likes}</p>
          <button onClick={handleLike} className="like-button">Like</button>

          { canDelete && (
            <button onClick={() => handleDeleteBlog(blog.id)} className="delete-button">Delete</button>
          )}
        
        </div>
      )}
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.shape({
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired,
    user: PropTypes.shape({
      username: PropTypes.string
    })
  }).isRequired,
  updateBlogs: PropTypes.func.isRequired,
  handleDeleteBlog: PropTypes.func.isRequired,
  handleLike: PropTypes.func.isRequired,
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
  }).isRequired,
}



export default Blog