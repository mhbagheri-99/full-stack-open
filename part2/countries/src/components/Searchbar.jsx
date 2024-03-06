const Searchbar = ({ handleQueryChange }) => {
    return (
        <div>
            find countries: <input onChange={handleQueryChange}/>
        </div>
    )
}

export default Searchbar