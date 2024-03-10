import { useState, useEffect } from 'react'
import contactService from './services/contacts'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([]) 

  useEffect(() => {
    contactService
      .getAll()
      .then(initialContacts => {
        setPersons(initialContacts)
        setQuery(initialContacts)
      })
  }, [])
  
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  const [query, setQuery] = useState(persons)

  const [errorMessage, setErrorMessage] = useState('')
  const [errorType, setErrorType ] = useState(null)

  const addContact = (event) => {
    event.preventDefault()
    if (persons.some(person => person.name === newName)) {
      if(window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const person = persons.find(person => person.name === newName)
        const changedPerson = { ...person, number: newNumber }
        contactService
          .update(person.id, changedPerson)
          .then(returnedContact => {
            setErrorType(false)
            setErrorMessage(
              `Contact '${changedPerson.name}' updated successfully.`
            )
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
            setPersons(persons.map(person => person.id !== returnedContact.id ? person : returnedContact))
            setQuery(persons.map(person => person.id !== returnedContact.id ? person : returnedContact))
          }).catch(error => {
            setErrorType(true)
            // setErrorMessage(
            //   `Contact '${changedPerson.name}' was already removed from the server.`
            // )
            setErrorMessage(error.response.data.error)
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
            setPersons(persons.filter(person => person.id !== changedPerson.id))
            setQuery(persons.filter(person => person.id !== changedPerson.id))
          })
      }
    } else if (persons.some(person => person.number === newNumber)) {
      setErrorType(true)
      setErrorMessage(
        `Number is already assigned to ${persons.find(person => person.number === newNumber).name}.`
      )
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    } else {
      const personObject = {
        name: newName,
        number: newNumber
      }
      contactService
        .create(personObject)
        .then(returnedContact => {
          setPersons(persons.concat(returnedContact))
          setQuery(persons.concat(returnedContact))
        }).catch(error => {
          setErrorType(true)
          setErrorMessage(
            error.response.data.error
          )
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })
    }
    setNewName('')
    setNewNumber('')
  }
  
  const removeContact = (id) => {
    const contact = persons.find(person => person.id === id)
    if (window.confirm(`Delete ${contact.name}?`)) {
      contactService
        .remove(id)
        .then(() => {
          setErrorType(false)
          setErrorMessage(
            `Contact '${contact.name}' removed successfully.`
          )
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
          setPersons(persons.filter(person => person.id !== id))
          setQuery(persons.filter(person => person.id !== id))
        }).catch(error => {
          setErrorType(true)
          setErrorMessage(
            `Contact '${contact.name}' was already removed from the server.`
          )
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
          setPersons(persons.filter(person => person.id !== id))
          setQuery(persons.filter(person => person.id !== id))
        })
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleQueryChange = (event) => {
    if (event.target.value === '') {
      setQuery(persons)
    } else {
      setQuery(persons.filter(person => 
        person.name.toLowerCase().includes(event.target.value.toLowerCase())))
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage} type={errorType}/>
      <Filter handleQueryChange={handleQueryChange}/>
      <h3>Add a new</h3>
      <PersonForm newName={newName} newNumber={newNumber} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} addContact={addContact}/>
      <h3>Contacts</h3>
      <Persons persons={query} removeContact={removeContact}/>
    </div>
  )
}

export default App