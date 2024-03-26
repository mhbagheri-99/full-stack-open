/* eslint-disable react/prop-types */
const Notification = ({ content }) => {
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 5
  }

  if (content === '') {
    style.display = 'none'
  } else {
    style.display = ''
  }

  return (
    <div style={style}>
      {content}
    </div>
  )
}

export default Notification
