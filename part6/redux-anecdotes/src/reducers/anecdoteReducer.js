import { createSlice } from '@reduxjs/toolkit'
import anecdoteServices from '../services/anecdotes'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    vote(state, action) {
      const id = action.payload
      const anecdoteToChange = state.find(n => n.id === id)
      anecdoteToChange.votes++
      state.sort((a, b) => b.votes - a.votes)
    },
    appendAnecdotes(state, action) {
      state.push(action.payload)
    },
    setAnecdotes(state, action) {
      return action.payload.sort((a, b) => b.votes - a.votes)
    }
  }
})

export const { vote, appendAnecdotes, setAnecdotes } = anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteServices.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdoteServices.createNew(content)
    dispatch(appendAnecdotes(newAnecdote))
  }
}

export const voteAnecdote = id => {
  return async dispatch => {
    const state = await anecdoteServices.getAll()
    const anecdoteToChange = state.find(n => n.id === id)
    anecdoteToChange.votes++
    await anecdoteServices.update(anecdoteToChange.id, anecdoteToChange)
    dispatch(vote(id))
  }
}

export default anecdoteSlice.reducer