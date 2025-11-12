import { useState, useEffect } from 'react';
import axios from 'axios';

const Weather = ({ latitude, longitude, location }) => {
  const [weather, setWeather] = useState({
    temp: null,
    wind: null,
    img: 'https://openweathermap.org/img/wn/01d@2x.png'
  });

  useEffect(() => {
    const apiKey = import.meta.env.VITE_API_KEY;
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=imperial`;

    axios
    .get(weatherUrl)
    .then((response) => {
      setWeather({
        temp: response.data.main.temp,
        wind: response.data.wind.speed,
        img: `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
      });
    })
    .catch(error => {console.log(error)})
  }, []);
  
  return (
    <>
      <h2>Weather in {location}</h2>
      <p>Temperature {weather.temp} Fahrenheit</p>
      <img src={weather.img} />
      <p>Wind {weather.wind} m/s</p>
    </>
  );
}

export default Weather;