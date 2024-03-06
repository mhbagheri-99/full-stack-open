import { useState, useEffect } from 'react'
import axios from 'axios'
import Searchbar from './components/Searchbar'
import CountryList from './components/CountryList'


function App() {
  const [countries, setCountries] = useState([])
  const [query, setQuery] = useState([])
  const [initState, setInitState] = useState(true)

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        console.log('promise fulfilled')
        setCountries(response.data)
        setQuery(response.data)
      })
  }, [])

  const handleQueryChange = (event) => {
    if (event.target.value === '') {
      setInitState(true)
      setQuery([countries])
      console.log('empty')
    } else {
      setInitState(false)
      setQuery(countries.filter(country => 
        country.name.common.toLowerCase().includes(event.target.value.toLowerCase())))
      console.log('not empty')
    }
  }

  return (
    <div>
      <h1>Country Info App</h1>
      <Searchbar handleQueryChange={handleQueryChange} />
      <CountryList countries={query} setCountries={setQuery} initState={initState}/>
    </div>
  )
}

export default App
