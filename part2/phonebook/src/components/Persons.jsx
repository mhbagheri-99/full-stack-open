const Persons = ({ persons, removeContact }) => {
    return (
        <div>
        <ul>
            {persons.map(person => 
                <div key={person.id}>
                <li>{person.name} {person.number}</li>
                <button onClick={() => removeContact(person.id)}>Delete</button>
                </div>
            )}
        </ul>
        </div>
    )
}

export default Persons