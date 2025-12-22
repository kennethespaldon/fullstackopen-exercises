const assert = require('node:assert')
const { test, beforeEach, after, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')
const blog = require('../models/blog')

const api = supertest(app)

describe('where there is initially some blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('blogs have an id property', async () => {
    const response = await api.get('/api/blogs')
    const blogs = response.body
    const blogsHaveIds = blogs.every(blog => blog.hasOwnProperty('id'))
    assert.strictEqual(blogsHaveIds, true)

    const blogIds = new Set(blogs.map(blog => blog.id))
    assert.strictEqual(blogIds.size, helper.initialBlogs.length)
  })

  describe('viewing a specific note', () => {
    test('succeeds with a valid id', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToView = blogsAtStart[0]

      const resultBlog = await api
        .get(`/api/blogs/${blogToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(resultBlog.body, blogToView)
    })
  })

  describe('addition of a new blog', () => {
    test.only('succeeds with valid data', async () => {    
      const logInResponse = await helper.logInUser()
      const token = logInResponse.token
      const username = logInResponse.username
      const user = await User.findOne({ username })

      const blogToBeAdded = {
        title: "Blog to be added",
        author: "Jordan Love",
        url: "https://reactpatterns.com/",
      }

      const response = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(blogToBeAdded)
        .expect(201)

      const addedBlog = response.body
      assert.strictEqual(addedBlog.user.toString(), user._id.toString())
      
      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
    })

    test('defaults likes to 0 if likes property is missing', async () => {
      const logInResponse = await helper.logInUser()
      const token = logInResponse.token

      const blogToBeAdded = {
        title: "Blog to be added",
        author: "Jordan Love",
        url: "https://reactpatterns.com/"
      }

      const response = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(blogToBeAdded)
        .expect(201)
      
      const addedBlog = response.body
      assert.strictEqual(addedBlog.likes, 0)

      const blogsAtEnd = await Blog.find({})
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
    })

    test('fails with statuscode 400 when title is missing', async () => {
      const logInResponse = await helper.logInUser()
      const token = logInResponse.token

      const blogToBeAdded = {
        author: "Jordan Love",
        url: "https://reactpatterns.com/",
        likes: 8      
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(blogToBeAdded)
        .expect(400)
    })

    test('fails with statuscode 400 when url is missing', async () => {
      const logInResponse = await helper.logInUser()
      const token = logInResponse.token

      const blogToBeAdded = {
        title: "Blog to be added",
        author: "Jordan Love",
        likes: 8
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(blogToBeAdded)
        .expect(400)
    })

    test('fails with statuscode 401 when token is not provided', async () => {
      const blogToBeAdded = {
        title: "Blog to be added",
        author: "Jordan Love",
        url: "https://reactpatterns.com/"
      }

      await api
        .post('/api/blogs')
        .send(blogToBeAdded)
        .expect(401)
    })
  })

  describe('deletion of a blog', () => {
    test('succeeds if blog exists', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()
      
      const blogIds = blogsAtEnd.map(blog => blog.id)
      assert(!blogIds.includes(blogToDelete.id))

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
    })

    test('fails with statuscode 404 if blog does not exist', async () => {
      const validNonexistingId = await helper.nonExistingId()
      await api
        .delete(`/api/blogs/${validNonexistingId}`)
        .expect(404)
    })

    test('fails with statuscode 400 if id is invalid', async () => {
      const invalidId = '5a422a851b54a676234d17f'

      await api
        .delete(`/api/blogs/${invalidId}`)
        .expect(400)
    })
  })

  describe('updating a blog', () => {
    test('succeeds if like count is updated', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]
      const updatedBlog = {
        ...blogToUpdate,
        likes: blogToUpdate.likes + 1
      }

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedBlog)
        .expect(200)

      const response = await api.get(`/api/blogs/${blogToUpdate.id}`)
      const savedBlog = response.body

      assert.deepStrictEqual(savedBlog, updatedBlog)
    })

    test('succeeds if the url is updated', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]
      const updatedBlog = {
        ...blogToUpdate,
        url: 'https://react.dev/'
      }

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedBlog)
        .expect(200)

      const response = await api.get(`/api/blogs/${blogToUpdate.id}`)
      const savedBlog = response.body

      assert.deepStrictEqual(savedBlog, updatedBlog)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})