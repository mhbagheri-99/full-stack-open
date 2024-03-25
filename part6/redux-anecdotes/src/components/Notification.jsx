import { useSelector } from 'react-redux'

const Notification = () => {
  const notification = useSelector(state => state.notification)
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    display: 'none'
  }
  if (notification === '' || notification === null) {
    style.display = 'none'
    return (
      <div style={style}>
        {notification}
      </div>
    )
  }
  else {
    style.display = ''
    return (
      <div style={style}>
        {notification}
      </div>
    )
  }
}

export default Notification