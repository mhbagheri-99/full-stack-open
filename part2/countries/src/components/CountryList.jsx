import Country from "./Country"

const CountryList = ({ countries, setCountries, initState }) => {
    if (initState) {
        return (
            <div>
                <p>Search for a country</p>
            </div>
        )
    } else {
        if (countries.length > 10) {
            return (
                <div>
                    <p>Too many matches, specify another filter</p>
                </div>
            )
        } else if (countries.length === 1) {
            return (
                <Country country={countries[0]} />
            )
        } else if (countries.length === 0) {
            return (
                <div>
                    <p>No matches, specify another filter</p>
                </div>
            )
        } else {    
            return (
                <div>
                    {countries.map(country => 
                        <p key={country.name.common}>{country.name.common} <button onClick={() => setCountries([country])}>Info</button> </p>
                    )}
                </div>
            )
        }
    }
}

export default CountryList