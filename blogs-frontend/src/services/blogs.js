import axios from 'axios'



const login = async ({ username, password }) => {
  try {
    // Asegúrate de que solo envíes el username y password
    const response = await axios.post('http://localhost:3003/api/login', {
      username,
      password,
    })

    // Aquí deberías recibir el token y otros datos de usuario en la respuesta
    console.log('Login successful:', response.data)

    // Almacena el token en localStorage o el estado
    localStorage.setItem('token', response.data.token)

    // Puedes retornar la data para manejarla luego
    return response.data
  } catch (error) {
    // Si ocurre un error, imprime el mensaje
    console.error('Login failed:', error.response ? error.response.data : error)
    throw error
  }
}

const setToken = (newToken) => {
  localStorage.removeItem('token')
  localStorage.removeItem('loggedBlogappUser')


  localStorage.setItem('loggedBlogAppUser', JSON.stringify(newToken))
  axios.defaults.headers['Authorization'] = `Bearer ${newToken.token}`
}

const getToken = () => {
  const loggedUserJSON = sessionStorage.getItem('loggedBlogAppUser')
  console.log('Logged User from Local Storage', loggedUserJSON)
  if (loggedUserJSON) {
    try {
      const user = JSON.parse(loggedUserJSON)
      return user.token
    } catch (error) {
      console.error('Error parsing loggedBlogAppUser:', error)
      return null
    }
  }
  return null
}

const getAllBlogs = async () => {
  const token = getToken()
  console.log('token retrieved', token)
  if (!token) {
    console.log('no token found')
    return
  }
  try {
    const response = await axios.get('http://localhost:3003/api/blogs', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    console.log('Blogs:', response.data)
    return response.data
  } catch (error) {
    console.error('Error getting blogs:', error.response ? error.response.data : error)
  }
}

const checkTokenExpiration = () => {
  const token = getToken()
  if (!token) return

  const decodedToken = JSON.parse(atob(token.split('.')[1]))
  const expirationDate = new Date(decodedToken.exp * 1000)
  if (expirationDate < new Date()) {
    console.log('Token expired')
    sessionStorage.removeItem('loggedBlogAppUser')
  }
}


const create = async newBlog => {
  const token = getToken()
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  }
  const response = await axios.post('http://localhost:3003/api/blogs', newBlog, config)
  return response.data
}

const update = async (id, updatedBlog) => {
  const token = getToken()
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  }
  const response = await axios.put(`http://localhost:3003/api/blogs/${id}`, updatedBlog, config)
  return response.data
}

const remove = async (id) => {
  const token = getToken()
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  }
  const response = await axios.delete(`http://localhost:3003/api/blogs/${id}`, config)
  return response.data
}


export default { login, setToken, getAllBlogs, getToken, checkTokenExpiration, create, update, delete: remove }