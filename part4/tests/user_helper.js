const User = require('../models/user')
const bcrypt = require('bcrypt')

const createInitialUsers = async () => {
  const saltRounds = 10
  const hash1 = await bcrypt.hash('youcantseeme', saltRounds)
  const hash2 = await bcrypt.hash('smackdown', saltRounds)

  return [
    { username: 'jcena', name: 'John Cena', passwordHash: hash1 },
    { username: 'jhardy', name: 'Jeff Hardy', passwordHash: hash2 }
  ]
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = {
  usersInDb, createInitialUsers
}