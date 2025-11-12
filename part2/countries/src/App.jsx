import { useState, useEffect } from 'react';
import axios from 'axios';
import Countries from './components/Countries';

const App = () => {
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState('');

  const getCountries = () => {
    const timer = setTimeout(() => {
      const url = 'https://studies.cs.helsinki.fi/restcountries/api/all';

      if (search.trim().length !== 0) {
        axios
          .get(url)
          .then(response => {                
            const filtered = response.data.filter(country => country.name.common.toLowerCase().includes(search.toLowerCase()));
            const invalidLength = filtered.length <= 0 || filtered.length > 10;
            setCountries(invalidLength ? [] : filtered);
          })
          .catch(error => console.log(error));
      }
    }, 500);

    return () => clearTimeout(timer);
  };

  useEffect(getCountries, [search]);

  return (
    <>
      <form>
        <label htmlFor="search-country">find countries</label>
        <input value={search} onChange={(e) => {setSearch(e.target.value);}} type="text" id="search-countries"></input>
      </form>
      <Countries countries={countries} />
    </>
  );
};

export default App;