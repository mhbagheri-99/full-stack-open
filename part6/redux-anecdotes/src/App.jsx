import { useEffect } from "react"
import { useDispatch } from "react-redux"

import { initializeAnecdotes } from "./reducers/anecdoteReducer"

import AnecdoteForm from "./components/AnecdoteForm"
import Anecdotes from "./components/Anecdotes"
import Filter from "./components/Filter"
import Notification from "./components/Notification"

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeAnecdotes())
  })

  return (
    <div>
      <h2>Anecdotes</h2>
      <Notification />
      <Filter />
      <Anecdotes />
      <AnecdoteForm />
    </div>
  )
}

export default App