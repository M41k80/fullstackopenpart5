import { useState } from 'react'

const BlogForm = ({ createBlog, showNotification }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()

    const newBlog = {
      title: newTitle,
      author: newAuthor,
      url: newUrl,
      likes: 0,
    }

    try {
      await createBlog(newBlog)
      setNewTitle('')
      setNewAuthor('')
      setNewUrl('')
      showNotification(`Blog "${newTitle}" añadido con éxito`, 'success')
    } catch (exception) {
      showNotification('Error al agregar el blog', 'error')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add a new blog</h2>
      <div>
        <label htmlFor="title">title:</label>
        <input
          id="title"
          name="title"
          type="text"
          value={newTitle}
          onChange={({ target }) => setNewTitle(target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="author">author:</label>
        <input
         id="author"
          name="author"
          type="text"
          value={newAuthor}
          onChange={({ target }) => setNewAuthor(target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="url">url:</label>
        <input
          id="url"
          name="url"
          type="url"
          value={newUrl}
          onChange={({ target }) => setNewUrl(target.value)}
          required
        />
      </div>
      <button type="submit">create</button>
    </form>
  )
}

export default BlogForm
