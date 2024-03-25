import { useSelector, useDispatch } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { setNotification, removeNotification } from '../reducers/notificationReducer'

const Anecdote = (anecdote, handleClick) => {
    return (
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={handleClick}>vote</button>
          </div>
        </div>
    )
}

const Anecdotes = () => {
    const anecdotes = useSelector( (state) => {
      if (state.filter === 'ALL') {
        return state.anecdotes
      }
      else {
        return state
        .anecdotes
        .filter(anecdote => anecdote.content.includes(state.filter))
      }
    })
    const dispatch = useDispatch()
    
    return (
        <div>
        {anecdotes.map(anecdote =>
            Anecdote(anecdote, async () => {
              dispatch(voteAnecdote(anecdote.id))
              dispatch(setNotification(`you voted '${anecdote.content}'`))
              setTimeout(() => {
                dispatch(removeNotification())
              }, 5000)
            })
        )}
        </div>
    )
}

export default Anecdotes