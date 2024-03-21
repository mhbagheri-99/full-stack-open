const { test, expect, describe, beforeEach } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
    beforeEach(async ({ page, request }) => {
        await request.post('/api/testing/reset')
        await request.post('/api/users', {
            data: {
                name: 'dumbo the elephant',
                username: 'dummy',
                password: 'dumbo'
            }
        })
        await page.goto('/')
      })

    test('Login form is shown', async ({ page }) => {
        const username = await page.getByText('username')
        await expect(username).toBeVisible()
        const password = await page.getByText('password')
        await expect(password).toBeVisible()
    })
    describe('Login', () => {
      test('fails with wrong credentials', async ({ page }) => {
          await loginWith(page, 'dummy', 'dumbooooo')
      
          const errorDiv = await page.locator('.notif')
          await expect(errorDiv).toContainText('Wrong credentials')
          await expect(errorDiv).toHaveCSS('border-style', 'solid')
          await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
          await expect(errorDiv).toHaveCSS('font-size', '20px')

          await expect(page.getByText('Welcome dumbo the elephant!')).not.toBeVisible()
        })

      test('succeeds with correct credentials', async ({ page }) => {
          await loginWith(page, 'dummy', 'dumbo')

          const notifDiv = await page.locator('.notif')
          await expect(notifDiv).toContainText('Welcome dumbo the elephant!')
          await expect(notifDiv).toHaveCSS('border-style', 'solid')
          await expect(notifDiv).toHaveCSS('color', 'rgb(0, 128, 0)')
          await expect(notifDiv).toHaveCSS('font-size', '20px')

          await expect(page.getByText('Wrong credentials')).not.toBeVisible()
      })

      describe('when logged in', () => {
          beforeEach(async ({ page }) => {
            await loginWith(page, 'dummy', 'dumbo')
          })
      
          test('a new blog can be created', async ({ page }) => {
            await createBlog(page, 'a blog title', 'a blog author', 'a blog url')

            await expect(page.getByText('Title: "a blog title"')).toBeVisible()
            await expect(page.getByText('Author: "a blog author"')).toBeVisible()
          })

          describe('and a blog exist', () => {
              beforeEach(async ({ page }) => {
                await createBlog(page, 'a blog title', 'a blog author', 'a blog url')
              })
          
              test('blog can be liked', async ({ page }) => {
                // const otherdNoteElement = await otherNoteText.locator('..')
                await page.getByRole('button', { name: 'Show More' }).click()
                await expect(page.getByText('Show Less')).toBeVisible()
                await page.getByRole('button', { name: 'like' }).click()
                await expect(page.getByText('Likes: 1')).toBeVisible()
              })
    
              test('blog can be deleted', async ({ page }) => {
                // wait till blog like notif is gone
                await page.waitForTimeout(5000)
                await page.getByRole('button', { name: 'Show More' }).click()
                await expect(page.getByText('Show Less')).toBeVisible()

                page.once('dialog', dialog => {
                  console.log(`Dialog message: ${dialog.message()}`);
                  dialog.accept().catch(() => {});
                });
                await page.getByRole('button', { name: 'Remove' }).click();
                
                const notifDiv = await page.locator('.notif')
                await expect(notifDiv).toContainText('Removed')
              })
          })

          describe('multiple blogs with random number of likes', () => {
            beforeEach(async ({ page }) => {
              await createBlog(page, 'a blog title', 'a blog author', 'a blog url')
              await createBlog(page, 'another blog title', 'another blog author', 'another blog url')
              await createBlog(page, 'third blog title', 'third blog author', 'third blog url')
            })

            test('blogs liked randomly', async ({ page }) => {
              let randomInt = []
              const blogs = await page.getByTestId('blog').all()
              for(let i = 0; i < blogs.length; i++) {
                await blogs[i].getByRole('button', { name: 'Show More' }).click()
                await expect(blogs[i].getByRole('button', { name: 'Show Less' })).toBeVisible()
                randomInt.push(Math.floor(Math.random() * 10))
                for(let j = 1; j <= randomInt[i]; j++) {
                  await blogs[i].getByRole('button', { name: 'like' }).click()
                  await expect(blogs[i].getByText(`Likes: ${j}`)).toBeVisible()
                }
              }
              console.log(randomInt)
              let sortedRandomInt = randomInt.sort((a, b) => b - a)
              console.log(sortedRandomInt)

              await page.waitForTimeout(1000)

              const likedBlogs = await page.getByTestId('blog').all()
              for(let i = 0; i < likedBlogs.length; i++) {
                await expect(blogs[i].getByText(`Likes: ${sortedRandomInt[i]}`)).toBeVisible()
              }
            })
          })
        })
    })
})