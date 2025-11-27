const mongoose = require('mongoose')
const isPasswordProvided = process.argv.length >= 3
if (!isPasswordProvided) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0.ihinf0x.mongodb.net/phonebook?appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url, { family: 4 })

const contactSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Contact = mongoose.model('Contact', contactSchema)

const shouldAddContact = process.argv.length === 5
const shouldQueryDatabase = process.argv.length === 3
if (shouldAddContact) {
  const name = process.argv[3]
  const number = process.argv[4]

  const contact = new Contact({
    name,
    number,
  })

  contact.save().then((result) => {
    console.log(`added ${result.name} number ${result.number} to phonebook`)
    mongoose.connection.close()
  })
} else if (shouldQueryDatabase) {
  Contact.find({}).then((result) => {
    console.log('phonebook:')
    result.forEach((contact) =>
      console.log(`${contact.name} ${contact.number}`)
    )
    mongoose.connection.close()
  })
}
