import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Blog from './Blog'
import { expect, vi } from 'vitest'
import blogService from '../services/blogs'

vi.mock('../services/blogs', () => ({
    update: vi.fn(() => Promise.resolve({}))
}))

const mockHandleDeleteBlog = vi.fn()
const mockUpdateBlogs = vi.fn()
const mockHandleLike = vi.fn()

describe('Blog component', () => {
    const blog = {
        id: 1,
        title: 'Test Blog title',
        author: 'Test Author',
        url: 'https://test.com',
        likes: 10,
    }

    test('renders title and author , but not url or likes by default', () => {
        render(<Blog blog={blog} updateBlogs={mockUpdateBlogs} handleDeleteBlog={mockHandleDeleteBlog} />)


        const titleElement = screen.getByText(/Test Blog title/i)
        const authorElement = screen.getByText(/Test Author/i)
        expect(titleElement).toBeInTheDocument()
        expect(authorElement).toBeInTheDocument()

        const urlElement = screen.queryByText(blog.url)
        const likesElement = screen.queryByText(`Likes: ${blog.likes}`)
        expect(urlElement).toBeNull()
        expect(likesElement).toBeNull()
    })

    test('shows url and likes when "view details" button is clicked', () => {
        render(<Blog blog={blog} updateBlogs={mockUpdateBlogs} handleDeleteBlog={mockHandleDeleteBlog} />)

        expect(screen.queryByText(/https:\/\/test.com/i)).toBeNull()
        expect(screen.queryByText(/Likes: 10/i)).toBeNull()

        const button = screen.getByText(/view details/i)
        fireEvent.click(button)

        const urlElement = screen.getByText(/https:\/\/test.com/i)
        const likesElement = screen.getByText(/Likes: 10/i)
        expect(urlElement).toBeInTheDocument()
        expect(likesElement).toBeInTheDocument()

        expect(button).toHaveTextContent('hide details')
    })

    test('calls handleLike twice when "Like" button is clicked twice', async () => {
        

        render(<Blog blog={blog} updateBlogs={mockUpdateBlogs} handleDeleteBlog={mockHandleDeleteBlog} handleLike={mockHandleLike} />)

        const buttonViewDetails = screen.getByText(/view details/i)
        fireEvent.click(buttonViewDetails)

        const likeButton = screen.getByText('Like')

        fireEvent.click(likeButton)
        fireEvent.click(likeButton)

        await waitFor(() => {
            expect(mockHandleLike).toHaveBeenCalledTimes(2)
        })

    })
  

})

