require('dotenv').config()
const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)
mongoose.connect(url, { family: 4 })

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    validate: {
      validator: function (phoneNumber) {
        return /\d{2,3}-{1}\d{7,8}/.test(phoneNumber)
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
    minLength: 8,
    required: true,
  },
})

contactSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Contact', contactSchema)
