import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import BlogForm from './BlogForm'// Asegúrate de que la ruta es la correcta
import '@testing-library/jest-dom'// Para las aserciones como .toBeInTheDocument()
import { vi } from 'vitest'

test('calls createBlog with correct details and shows notification on successful blog creation', async () => {
  // Mock de las funciones createBlog y showNotification
  const mockCreateBlog = vi.fn(() => Promise.resolve()) // Simula una respuesta exitosa
  const mockShowNotification = vi.fn()

  // Renderizamos el componente BlogForm
  render(
    <BlogForm createBlog={mockCreateBlog} showNotification={mockShowNotification} />
  )

  
  const titleInput = screen.getByRole('textbox', { name: /title/i })
  const authorInput = screen.getByRole('textbox', { name: /author/i })
  const urlInput = screen.getByRole('textbox', { name: /url/i })
  const submitButton = screen.getByRole('button', { name: /create/i })

  
  fireEvent.change(titleInput, { target: { value: 'New Blog Title' } })
  fireEvent.change(authorInput, { target: { value: 'Author Name' } })
  fireEvent.change(urlInput, { target: { value: 'https://new-blog.com' } })
 
  fireEvent.click(submitButton)

  // Verificamos que la función createBlog se haya llamado con los valores correctos
  await waitFor(() => {
    expect(mockCreateBlog).toHaveBeenCalledTimes(1)
    expect(mockCreateBlog).toHaveBeenCalledWith({
      title: 'New Blog Title',
      author: 'Author Name',
      url: 'https://new-blog.com',
    })
  })

  // Verificamos que el formulario se haya limpiado después del envío
  expect(titleInput.value).toBe('')
  expect(authorInput.value).toBe('')
  expect(urlInput.value).toBe('')

  // Verificamos que showNotification haya sido llamada con el mensaje correcto
  expect(mockShowNotification).toHaveBeenCalledWith(
    'Blog "New Blog Title" añadido con éxito', 'success'
  )
})

test('shows error notification when blog creation fails', async () => {
    const mockCreateBlog = vi.fn(() => Promise.reject('Error al crear el blog'))
    const mockShowNotification = vi.fn()
  
    render(
      <BlogForm createBlog={mockCreateBlog} showNotification={mockShowNotification} />
    )
  
    const titleInput = screen.getByLabelText(/title/i)
    const authorInput = screen.getByLabelText(/author/i)
    const urlInput = screen.getByLabelText(/url/i)
    const submitButton = screen.getByText('create')
  
    fireEvent.change(titleInput, { target: { value: 'New Blog Title' } })
    fireEvent.change(authorInput, { target: { value: 'Author Name' } })
    fireEvent.change(urlInput, { target: { value: 'https://new-blog.com' } })
  
    fireEvent.click(submitButton)
  
    
    await waitFor(() => {
      expect(mockShowNotification).toHaveBeenCalledWith('Error al agregar el blog', 'error');
    })
  })
  