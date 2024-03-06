import { useState, useEffect } from 'react'
import axios from 'axios'

const Country = ({ country }) => {
    const [weather, setWeather] = useState([])

    const api_key = import.meta.env.VITE_SOME_KEY

    const lat = country.latlng[0]
    const lon = country.latlng[1]

    useEffect(() => {
        axios
       .get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`)
        .then(response => {setWeather(response.data)})
        .catch(error => console.error(error))
        }, [])

    if (weather.length === 0) {
        return null
    } else {    
        return (
            <div>
                <h1>{country.name.common}</h1>
                <p>Capital: {country.capital}</p>
                <p>Population: {country.population}</p>
                <h2>Languages</h2>
                <ul>
                    {Object.values(country.languages).map(language => 
                        <li key={language}>{language}</li>
                    )}
                </ul>
                <img src={country.flags.png} alt={country.name.common} width="auto" height="100"/>
                <h2>Weather in {country.capital}</h2>
                <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt={weather.weather.description} width="auto" height="100"/>
                <p>Temperature: {weather.main.temp}°C</p>
                <p>Wind: {weather.wind.speed} m/s</p>
                <p>Direction: {weather.wind.deg}°</p>
            </div>
        )
    }
}

export default Country