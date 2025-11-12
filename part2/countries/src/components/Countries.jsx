import Country from './Country';

const Countries = ({ countries }) => {
  if (countries.length === 0) {
    return null;
  }

  if (countries.length === 1) {
    const country = countries[0];
    return <Country country={country} singleMatchFound={true} />
  } 

  return (
    <ul>
      {countries.map(country => <Country key={crypto.randomUUID()} country={country} />)}
    </ul>
  );
};

export default Countries;