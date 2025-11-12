import { useState } from 'react';
import Weather from './Weather';

const Country = ({ country, singleMatchFound}) => {
  const [showData, setShowData] = useState(false);

  const data = () => {
    const name = country.name.common;
    const capital = country.capital;
    const area = country.area;
    const languages = country.languages;

    return (
      <div>
        <h1>{name}</h1>
        <p>{capital}</p>
        <p>{area}</p>

        <h2>Languages</h2>
        <ul>
          {Object.values(languages).map(language => <li key={crypto.randomUUID()}>{language}</li>)}
        </ul>
        <img src={country.flags.svg} width="250" height="250"/>
        <Weather latitude={country.latlng[0]} longitude={country.latlng[1]} location={capital} />
      </div>
    );
  };

  if (singleMatchFound) {
    return data();
  }

  return (
    <li>
      {country.name.official}
      <button onClick={() => {setShowData(!showData)}}>Show</button>
      {showData ? data() : null}
    </li>
  )
};

export default Country;