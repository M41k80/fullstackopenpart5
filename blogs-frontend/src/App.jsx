import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notificacion from './components/Notificacion'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [notificacion , setNotificacion] = useState({message: '', type: ''})

  const showNotification = (message, type) => {
    setNotificacion({ message, type })
    setTimeout(() => {
      setNotificacion({ message: '', type: '' }) 
    }, 5000)
  }

 

 

  useEffect(() => {
    const loggedUserJSON = sessionStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      if (user && user.token) {
        setUser(user)
        blogService.setToken(user.token) 
      } else {
        console.log('User data is invalid or token misssing')
      }
      
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    console.log('username:', username)
    console.log('password:', password)

    try {
      const user = await loginService.login({
        username, password,
      })
      console.log('logged in as:', user)
      

      sessionStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      showNotification(`Logged in as   ${user.username}`, 'success')
    } catch (exception) {
      console.error('Login failed', exception.response?.data || exception.message)
      showNotification('wrong credentials', 'error')
    }
  }

  const loginForm = () => {
    return (
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    )
  }

  useEffect(() => {
    if (user) {
    blogService.getAllBlogs().then(blogs => {
      console.log('Blogs received:', blogs)
      const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes)
      setBlogs(sortedBlogs)
    }).catch(error => {
      console.error('Error getting blogs: ', error)
      showNotification('Error getting blogs', 'error')
    })
  }
  }, [user])

  const updateBlogs = () => {
    blogService.getAllBlogs().then(blogs => {
      const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes)
      setBlogs(sortedBlogs)
    })
  }


  const handleLogout = () => {
    sessionStorage.removeItem('loggedBlogAppUser')
    localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
    setBlogs([])
    showNotification('Logged out', 'success')
  }


  const createBlog = async (newBlog) => {
    const createdBlog = await blogService.create(newBlog) 
    setBlogs(blogs.concat(createdBlog)) 
  }

  const handleLike = async (id) => {
    const blogToUpdate = blogs.find(blog => blog.id === id);
    const updatedBlog = { ...blogToUpdate, likes: blogToUpdate.likes + 1 }
  
    try {
      const response = await blogService.update(id, updatedBlog);
      updateBlogs()  
      console.log('Blog liked:', response)
    } catch (error) {
      console.error('Error giving like:', error)
    }
  }
  

  const handleDeleteBlog = async (id) => {
    const blog_todelete = blogs.find(blog => blog.id === id)
    if (!blog_todelete) {
      console.error('Blog not found')
      return
    }
    const confirmed = window.confirm(`Are you sure you want to delete the blog: ${blog_todelete.title}?`)
    if (confirmed) {
      try {
        await blogService.delete(id)
        setBlogs(blogs.filter(blog => blog.id !== id))
        showNotification(`Blog with id ${id} deleted`, 'success')
      } catch (error) {
        console.error('Error deleting blog: ', error)
        showNotification(`Error deleting blog with id ${blog_todelete.title}`, 'error')
      }
      }
    }
  
  return (
    <div>
    <h2>blogs</h2>
    <div>
      <Notificacion message={notificacion.message} type={notificacion.type}/>
      {!user && loginForm()}
      {user && (
        <div>
          <p>{user.name} logged in</p>
          <button onClick={handleLogout}>logout</button>
          <Togglable>
            <BlogForm createBlog={createBlog} showNotification={showNotification} />
          </Togglable>
        </div>
      )}
    </div>

    {blogs && blogs.length > 0 ? (
  blogs.map(blog => (
    <Blog 
    key={blog.id} 
    blog={blog} 
    updateBlogs={updateBlogs} 
    handleDeleteBlog={handleDeleteBlog} 
    handleLike={handleLike} 
    user={user}/>
  ))
) : (
  <p>No blogs found</p>
)}

    </div>
  )
}

export default App