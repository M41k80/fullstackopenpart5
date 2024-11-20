
const loginWith = async (page, username, password) => {
    
    await page.fill('input[name="Username"]', username)
    await page.fill('input[name="Password"]', password)
    await page.click('button[type="submit"]')
  }
  
  const createBlog = async (page, title, author, url) => {
    
    await page.click('button[type="button"][data-cy="create-blog-button"]') 
    await page.fill('input[name="title"]', title)
    await page.fill('input[name="author"]', author)
    await page.fill('input[name="url"]', url)
    await page.click('button[type="submit"]')
  }
  
  module.exports = { loginWith, createBlog }