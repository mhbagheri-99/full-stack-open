const Notification = ({ message, type }) => {
  if (message === null || message === '') {
    return null
  }

  const error = {
    color: 'red',
    background:'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }

  const success = {
    color: 'green',
    background:'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }

  if (type) {
    return (
      <div style={error}>
        {message}
      </div>
    )
  } else {
    return (
      <div style={success}>
        {message}
      </div>
    )
  }
}

export default Notification