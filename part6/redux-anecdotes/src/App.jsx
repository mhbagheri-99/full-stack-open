// import { useSelector, useDispatch } from 'react-redux'
// import { createAnecdote, voteAnecdote } from './reducers/anecdoteReducer'

import AnecdoteForm from "./components/AnecdoteForm"
import Anecdotes from "./components/Anecdotes"

const App = () => {
  // const anecdotes = useSelector(state => state)
  // const dispatch = useDispatch()

  // const vote = (id) => {
  //   console.log('vote', id)
  //   dispatch(voteAnecdote(id))
  // }

  // const addAnecdote = (event) => {
  //   event.preventDefault()
  //   const content = event.target.anecdote.value
  //   event.target.anecdote.value = ''
  //   dispatch(createAnecdote(content))
  // }

  return (
    <div>
      <h2>Anecdotes</h2>
      <Anecdotes />
      <AnecdoteForm />
    </div>
  )
}

export default App