/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useReducer, useContext } from 'react'

const notificationReducer = (state, action) => {
  switch (action.type) {
    case "NEW":
        return `you created '${action.payload}'`
    case "VOTE":
        return `you voted for '${action.payload}'`
    case "ERROR":
        return "too short, anecdote's content should be at least 5 characters long"
    default:
        return ''
  }
}

const NotificationContext = createContext()

export const NotificationContextProvider = (props) => {
  const [notif, notifDispatch] = useReducer(notificationReducer, '')

  return (
    <NotificationContext.Provider value={[notif, notifDispatch] }>
      {props.children}
    </NotificationContext.Provider>
  )
}

export const useNotificationValue = () => {
    const notifAndDispatch = useContext(NotificationContext)
    return notifAndDispatch[0]
  }
  
export const useNotificationDispatch = () => {
    const notifAndDispatch = useContext(NotificationContext)
    return notifAndDispatch[1]
  }

export default NotificationContext
