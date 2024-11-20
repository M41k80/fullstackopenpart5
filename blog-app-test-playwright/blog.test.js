const { test, describe, expect, beforeEach } = require('@playwright/test')
const axios = require('axios')
const { loginWith, createBlog } = require('./helper')

describe('Blog App', () => {
  let user
  let anotherUser
  let token

  beforeEach(async ({ page, request }) => {
    
    await request.post('http://localhost:3003/api/testing/reset')

    user = {
      username: 'm41k80',
      password: 'contraseñaSegura1234',
      name: 'm4k180',
    }

    anotherUser = {
      username: 'anotheruser',
      password: 'password1234',
      name: 'anotheruser',
    }

    
    await axios.post('http://localhost:3003/api/users', user)
    await axios.post('http://localhost:3003/api/users', anotherUser)

    
    const loginResponse = await axios.post('http://localhost:3003/api/login', {
      username: user.username,
      password: user.password,
    })
    token = loginResponse.data.token

   
    await page.goto('http://localhost:5173')

   
    await page.addInitScript((token) => {
      sessionStorage.setItem('loggedBlogAppUser', JSON.stringify({ token }))
    }, token)

    
    await page.reload()
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.locator('form')).toBeVisible()
    await expect(page.locator('input[name="Username"]')).toBeVisible()
    await expect(page.locator('input[name="Password"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, user.username, user.password)
      await expect(page.locator(`text=Logged in as ${user.username}`)).toBeVisible()
    })

    test('fails with incorrect credentials', async ({ page }) => {
      await loginWith(page, 'wronguser', 'wrongpassword')
      await expect(page.locator('text=wrong credentials')).toBeVisible()
    })

    test('a new blog can be created', async ({ page }) => {
       
        const token = await page.evaluate(() => {
            return JSON.parse(sessionStorage.getItem('loggedBlogAppUser'))?.token
        })
    
        if (!token) {
            throw new Error("No token found")
        }
    
        
        await loginWith(page, user.username, user.password)
    
       
        const createBlogButton = page.locator('button:has-text("Create new blog")')
        await expect(createBlogButton).toBeVisible({ timeout: 10000 })
        await createBlogButton.click()
    
        
        const newTitle = 'hola hola'
        const newAuthor = 'm41k80'
        const newUrl = 'https://example.com/nuevo-blog'
    
        await page.locator('input[name="title"]').fill(newTitle)
        await page.locator('input[name="author"]').fill(newAuthor)
        await page.locator('input[name="url"]').fill(newUrl)
    
        
        await page.locator('button[type="submit"]').click()
    
       
        await expect(page.locator(`.blog .blog-title:has-text("${newTitle} by")`)).toBeVisible()
        await expect(page.locator(`.blog .blog-author:has-text("${newAuthor}")`)).toBeVisible()
        
    
       
        
        await expect(page.locator('.blog .view-details')).toBeVisible();
    })

    test('user can delete the blog they created', async ({ page }) => {
      const token = await page.evaluate(() => {
        return JSON.parse(sessionStorage.getItem('loggedBlogAppUser'))?.token
    })

    if (!token) {
        throw new Error("No token found")
    }

    
    await loginWith(page, user.username, user.password)

    
    const createBlogButton = page.locator('button:has-text("Create new blog")')
    await expect(createBlogButton).toBeVisible({ timeout: 10000 })
    await createBlogButton.click()

    
    const newTitle = 'hola hola'
    const newAuthor = 'm41k80'
    const newUrl = 'https://example.com/nuevo-blog'

    await page.locator('input[name="title"]').fill(newTitle)
    await page.locator('input[name="author"]').fill(newAuthor)
    await page.locator('input[name="url"]').fill(newUrl)

    
    await page.locator('button[type="submit"]').click()

   
    await expect(page.locator(`.blog .blog-title:has-text("${newTitle} by")`)).toBeVisible()
    await expect(page.locator(`.blog .blog-author:has-text("${newAuthor}")`)).toBeVisible()
    

   
    
    await expect(page.locator('.blog .view-details')).toBeVisible();
      
      const viewDetailsButton = page.locator('.blog button:has-text("view details")')
      await viewDetailsButton.click()
  
      
      await expect(page.locator('.blog button:has-text("Like")')).toBeVisible()
      await expect(page.locator('.blog button:has-text("Delete")')).toBeVisible()
  
      
      
      page.on('dialog', async dialog => {
        expect(dialog.message()).toBe(`Are you sure you want to delete the blog: ${newTitle}?`)
        await dialog.accept()
      })
      
      const deleteButton = page.locator('.blog button:has-text("Delete")')
      await deleteButton.click()

      

  
      
      await expect(page.locator(`.blog .blog-title:has-text("${newTitle}")`)).not.toBeVisible()
    })

    test('only the creator can see the delete button', async ({ page }) => {
      const token = await page.evaluate(() => {
        return JSON.parse(sessionStorage.getItem('loggedBlogAppUser'))?.token
    })

    if (!token) {
        throw new Error("No token found")
    }

    
    await loginWith(page, user.username, user.password)

    
    const createBlogButton = page.locator('button:has-text("Create new blog")')
    await expect(createBlogButton).toBeVisible({ timeout: 10000 })
    await createBlogButton.click()

    
    const newTitle = 'hola hola'
    const newAuthor = 'm41k80'
    const newUrl = 'https://example.com/nuevo-blog'

    await page.locator('input[name="title"]').fill(newTitle)
    await page.locator('input[name="author"]').fill(newAuthor)
    await page.locator('input[name="url"]').fill(newUrl)

    
    await page.locator('button[type="submit"]').click()

   
    await expect(page.locator(`.blog .blog-title:has-text("${newTitle} by")`)).toBeVisible()
    await expect(page.locator(`.blog .blog-author:has-text("${newAuthor}")`)).toBeVisible()
    

   
    
    await expect(page.locator('.blog .view-details')).toBeVisible();
      
      const viewDetailsButton = page.locator('.blog button:has-text("view details")')
      await viewDetailsButton.click()
  
      
      await expect(page.locator('.blog button:has-text("Like")')).toBeVisible()
      await expect(page.locator('.blog button:has-text("Delete")')).toBeVisible()

      
    })


    test('other user cant see delete button', async ({ page }) => {
      const token = await page.evaluate(() => {
        return JSON.parse(sessionStorage.getItem('loggedBlogAppUser'))?.token
    })

    if (!token) {
        throw new Error("No token found")
    }

    await loginWith(page, user.username, user.password)

    
    const createBlogButton = page.locator('button:has-text("Create new blog")')
    await expect(createBlogButton).toBeVisible({ timeout: 10000 })
    await createBlogButton.click()

    
    const newTitle = 'hola hola'
    const newAuthor = 'm41k80'
    const newUrl = 'https://example.com/nuevo-blog'

    await page.locator('input[name="title"]').fill(newTitle)
    await page.locator('input[name="author"]').fill(newAuthor)
    await page.locator('input[name="url"]').fill(newUrl)

    
    await page.locator('button[type="submit"]').click()

   
    await expect(page.locator(`.blog .blog-title:has-text("${newTitle} by")`)).toBeVisible()
    await expect(page.locator(`.blog .blog-author:has-text("${newAuthor}")`)).toBeVisible()
    

   
    
    await expect(page.locator('.blog .view-details')).toBeVisible();
      
      const viewDetailsButton = page.locator('.blog button:has-text("view details")')
      await viewDetailsButton.click()
  
      
      await expect(page.locator('.blog button:has-text("Like")')).toBeVisible()
      await expect(page.locator('.blog button:has-text("Delete")')).toBeVisible()

      await page.locator('button:has-text("logout")').click()

      
    await loginWith(page, anotherUser.username, anotherUser.password)

    await expect(page.locator('.blog .view-details')).toBeVisible();
      
      
    await viewDetailsButton.click()
  
      
      await expect(page.locator('.blog button:has-text("Like")')).toBeVisible()
      await expect(page.locator('.blog button:has-text("Delete")')).not.toBeVisible()


  })
    
})

  
})

