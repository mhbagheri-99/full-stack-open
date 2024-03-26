import { useContext } from 'react'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'

import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { getAnecdotes, createAnecdote, updateAnecdote } from './requests'
import NotificationContext from './NotificationContext'

const App = () => {
  const [notif, notifDispatch] = useContext(NotificationContext)

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    refetchOnWindowFocus: false,
    retry: 1
  })
  console.log(JSON.parse(JSON.stringify(result)))
  
  const queryClient = useQueryClient()
  
  const newAnecdoteMutation = useMutation({ 
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], anecdotes.concat(newAnecdote))
      notifDispatch({ type: 'NEW', payload: newAnecdote.content })
      setTimeout(() => {
        notifDispatch({ type: '' })
      }, 5000)
    },
    onError: (error) => {
      notifDispatch({ type: 'ERROR' })
      setTimeout(() => {
        notifDispatch({ type: '' })
      }, 5000)
    }
  })
  
  const addNewAnecdote = async (content) => {
    newAnecdoteMutation.mutate({ content, votes: 0 })
  }

  const voteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      const updatedAnecdotes = anecdotes.map(anecdote => anecdote.id === newAnecdote.id ? newAnecdote : anecdote)
      queryClient.setQueryData(['anecdotes'], updatedAnecdotes)
      notifDispatch({ type: 'VOTE', payload: newAnecdote.content })
      setTimeout(() => {
        notifDispatch({ type: '' })
      }, 5000)
    }
  })
  
  const voteAnecdote = (anecdote) => {
    voteMutation.mutate({...anecdote, votes: anecdote.votes + 1})
  }
  
  if ( result.isLoading ) {
    return <div>loading data...</div>
  }

  if ( result.isError ) {
    return <div>failed to load data because of server problems</div>
  }

  const anecdotes = result.data

  return (
    <div>
      <h3>Anecdote app</h3>
    
      <Notification content={notif}/>
      <AnecdoteForm addNewAnecdote={addNewAnecdote}/>
    
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => voteAnecdote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
