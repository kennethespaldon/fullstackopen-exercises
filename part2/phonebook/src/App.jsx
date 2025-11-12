import { useState, useEffect } from 'react';
import phonebook from './services/phonebook';
import Notification from './components/Notification';

const Filter = ({ filterName, handleFilterName}) => {
  return (
    <div>
      filter shown with <input value={filterName} onChange={handleFilterName}/>
    </div>
  );
};

const PersonForm = (props) => {
  return (
    <form>
      <div>
        name: <input value={props.newName} onChange={props.handleNewName}/>
      </div>
      <div>
        number: <input value={props.newNumber} onChange={props.handleNewNumber} />
      </div>
      <div>
        <button type="button" onClick={event => {props.addPerson(event)}}>add</button>
      </div>
    </form>
  );
};

const Person = ({ person, handleDelete }) => {
  return (
    <>
      <li>
        {person.name} {person.number} 
        <button type="button" onClick={() => {handleDelete(person.name)}}>Delete</button>
      </li>
    </>
  );
};

const Persons = ({ persons, filterName, handleDelete }) => {
    const displayedPersons = filterName.trim()
      ? persons.filter(person => person.name.toLowerCase().includes(filterName.toLowerCase()))
      : persons;
  return (
    <ul>
      {displayedPersons.map(person => <Person key={person.id} person={person} handleDelete={handleDelete}/>)}
    </ul>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);

  useEffect(() => {
    phonebook
      .getContacts()
      .then(contacts => {
        setPersons(contacts);
      });
  }, []);

  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filterName, setFilterName] = useState('');
  const [message, setMessage] = useState([null, null]);

  const addPerson = (event) => {
    event.preventDefault();

    const isDuplicate = persons.some(person => person.name === newName || person.number === newNumber);
    if (!isDuplicate) {
      const newPerson = { name: newName, number: newNumber};

      phonebook
        .addContact(newPerson)
        .then(newContact => {
          setMessage([`Added ${newContact.name}`, 'success']);
          setTimeout(() => setMessage([null, null]), 3000);
          setPersons(persons.concat(newContact));
          setNewName('');
          setNewNumber('');
        });
    } else if (confirm(`${newName} is already added to the phonebook, replace the old number with a new one?`)) {
      const person = persons.find((person) => person.name.toLowerCase() === newName.toLowerCase());

      if (person) {
        const id = person.id;
        const newContact = {...person, number: newNumber};
        phonebook
          .updateContact(id, newContact)
          .then(contact => {
            setMessage([`Added ${newContact.name}`, 'success']);
            setTimeout(() => setMessage([null, null]), 3000);
            setPersons(persons.map(person => person.id === contact.id ? contact : person))
            setNewName('');
            setNewNumber('');
          });
      }
    };
  }

  const handleDelete = (name) => {
    const confirmed = confirm(`delete ${name}?`);
    if (confirmed) {
      const contact = persons.find(person => person.name.toLowerCase() === name.toLowerCase());      
      if (contact) {
        const id = contact.id;
        phonebook
          .deleteContact(id)
          .then(() => setPersons(persons.filter(person => person.id !== id)))
          .catch(error => {
            setMessage([`Information of ${name} has already been removed from server`]);
            setTimeout(() => setMessage([null, null]), 3000);
            setPersons(persons.filter(person => person.id !== id));
          });
      }
    }
  };

  const handleNewName = (event) => {
    setNewName(event.target.value)
  };

  const handleNewNumber = (event) => {
    setNewNumber(event.target.value);
  };

  const handleFilterName = (event) => {
    setFilterName(event.target.value);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message[0]} status={message[1]}/>
      <Filter filterName={filterName} handleFilterName={handleFilterName} />
      <h2>Add a new</h2>
      <PersonForm 
        newName={newName} 
        newNumber={newNumber} 
        handleNewName={handleNewName} 
        handleNewNumber={handleNewNumber} 
        addPerson={addPerson} 
      />
      <h2>Numbers</h2>
      <Persons persons={persons} filterName={filterName} handleDelete={handleDelete}/>
    </div>
  );
};

export default App;