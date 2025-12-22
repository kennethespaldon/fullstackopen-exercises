const assert = require('node:assert')
const { test, describe, after, beforeEach} = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const helper = require('./user_helper')

const api = supertest(app)

describe('when there is initially some users saved', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const initialUsers = await helper.createInitialUsers()
    await User.insertMany(initialUsers)
  })

  test('all users are returned', async () => {
    const usersInDb = await helper.usersInDb()

    const response = await api.get('/api/users')
    const users = response.body
    assert.deepStrictEqual(users, usersInDb)
  })

  describe('creation of a new user', () => {
    test('succeeds with valid credentials', async () => {
      const usersAtStart = await helper.usersInDb()
      
      const newUser = {
        username: 'dbautista',
        name: 'Dave Bautista',
        password: 'bautistabomb'
      }

      const response = await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const savedUser = response.body
      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

      const usernames = usersAtEnd.map(user => user.username)
      assert(usernames.includes(savedUser.username))
    })

    test('fails with statuscode 400 if invalid password given', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'dbautista',
        name: 'Dave Bautista'
      }

      const response = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()

      assert(response.body.error.includes('password missing or length < 3'))
      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})