const express = require('express')
const app = express()
const morgan = require('morgan')
const Contact = require('./models/contact')

let phonebook = [
  {
    id: '1',
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: '2',
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: '3',
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: '4',
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
]

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(express.static('dist'))
app.use(express.json())
app.use(requestLogger)

morgan.token('data', (req, res) => {
  return JSON.stringify(req.body)
})

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :data')
)

app.get('/api/persons', (req, res) => {
  Contact.find({}).then((contacts) => {
    res.json(contacts)
  })
})

app.get('/info', (req, res) => {
  Contact.find({}).then((contacts) => {
    const date = new Date().toString()
    res.setHeader('Content-Type', 'text/html')
    res.send(`
        <p>Phonebook has info for ${contacts.length} people</p>
        <p>${date}</p>
      `)
  })
})

app.get('/api/persons/:id', (req, res, next) => {
  Contact.findById(req.params.id)
    .then((contact) => {
      if (!contact) {
        return res.status(404).end()
      }

      res.json(contact)
    })
    .catch((error) => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Contact.findByIdAndDelete(req.params.id)
    .then((contact) => {
      res.status(204).end()
    })
    .catch((error) => next(error))
})

app.post('/api/persons', (req, res, next) => {
  const { name, number } = req.body

  if (phonebook.some((person) => person.name === name)) {
    return res.status(400).json({
      error: 'name must be unique',
    })
  }

  const addedContact = new Contact({
    name,
    number,
  })

  addedContact
    .save()
    .then((contact) => {
      res.json(contact)
    })
    .catch((error) => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const { number } = req.body

  Contact.findById(req.params.id)
    .then((contact) => {
      contact.number = number

      return contact.save().then((updatedContact) => {
        res.json(updatedContact)
      })
    })
    .catch((error) => next(error))
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT)
