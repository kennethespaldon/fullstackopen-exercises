import axios from 'axios';

const url = 'http://localhost:3001/persons';

const getContacts = () => {
  const request = axios.get(url);
  const nonExisting = {
    "name": "Posty",
    "number": "489302",
    "id": "7",
  };
  return request.then(response => response.data.concat(nonExisting));
};

const addContact = (contact) => {
  const request = axios.post(url, contact);
  return request.then(response => response.data);
};

const deleteContact = (id) => {
  const request = axios.delete(`${url}/${id}`);
  return request.then(response => response.data);
};

const updateContact = (id, contact) => {
  const request = axios.put(`${url}/${id}`, contact);
  return request.then(response => response.data);
};

export default { getContacts, addContact, deleteContact, updateContact };