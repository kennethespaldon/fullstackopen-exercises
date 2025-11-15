const express = require('express');
const app = express();
const morgan = require('morgan');

let phonebook = [
  { 
    "id": "1",
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": "2",
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": "3",
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": "4",
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
];

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method);
  console.log('Path:  ', request.path);
  console.log('Body:  ', request.body);
  console.log('---');
  next();
};

app.use(express.json());
// app.use(requestLogger);
app.use(express.static('dist'));

morgan.token('data', (req, res) => { 
  return JSON.stringify(req.body);
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'));

app.get('/api/persons', (req, res) => {
  res.json(phonebook);
});

app.get('/info', (req, res) => {
  const date = new Date().toString();
  res.setHeader('Content-Type', 'text/html');
  res.send(`
    <p>Phonebook has info for ${phonebook.length} people</p>
    <p>${date}</p>
  `);
});

app.get('/api/persons/:id', (req, res) => {
  const [ person ] = phonebook.filter(person => person.id === req.params.id);

  if (!person) {
    return res.status(404).send('Person not found');
  }

  res.json(person);
});

app.delete('/api/persons/:id', (req, res) => {
  phonebook = phonebook.filter(person => person.id !== req.params.id);
  res.status(204).end();
});

const generateId = () => {
  return Math.floor(Math.random() * 10_000_000);
};

app.post('/api/persons', (req, res) => {
  const { name, number } = req.body;

  if (!(name && number)) {
    return res.status(400).json({
      error: 'content missing'
    });
  }

  if (phonebook.some(person => person.name === name)) {
    return res.status(400).json({
      error: 'name must be unique'
    });
  }
  
  let id;
  do {
    id = generateId();
  } while (phonebook.some(person => person.id === String(id)))

  const addedContact = { 
    id: String(id), 
    name, 
    number,
  };

  phonebook = phonebook.concat(addedContact);
  res.json(addedContact);
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

const PORT = 3001;
app.listen(PORT);