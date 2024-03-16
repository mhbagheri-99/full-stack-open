import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'

const initialValues = {
  title: "",
  author: "",
  url: "",
};

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newBlog, setNewBlog] = useState(initialValues)
  // const [newBlogTitle, setNewBlogTitle] = useState('')
  // const [newBlogAuthor, setNewBlogAuthor] = useState('')
  // const [newBlogURL, setNewBlogURL] = useState('')

  const [errorMessage, setErrorMessage] = useState(null)
  // False means success, true means error
  const [errorType, setErrorType] = useState(null)

  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [user, newBlog])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      ) 
      blogService.setToken(user.token)
      setUser(user)
      setErrorType(false)
      setErrorMessage(`Welcome ${(user.name) ? user.name : user.username}!`)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorType(true)
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    setErrorType(false)
      setErrorMessage(`${(user.name) ? user.name : user.username} successfully logged out!`)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    setUser(null)
    setBlogs([]) // doesn't work???
  }

  const handleBlogChange = (e) => {
    const { name, value } = e.target;

    setNewBlog({
      ...newBlog,
      [name]: value,
    });
  };

  const addBlog = (event) => {
    event.preventDefault()
    blogService.create(newBlog)
    setErrorType(false)
      setErrorMessage(`Blog "${newBlog.title}" by "${newBlog.author}" added`)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={errorMessage} type={errorType}/>
      {user === null ?
      <LoginForm handleLogin={handleLogin} username={username}
      setUsername={setUsername} password={password} setPassword={setPassword} /> 
      :
      <div>
        <p>{(user.name) ? user.name : user.username} logged-in 
        <button onClick={handleLogout}>Logout</button> </p>
        <BlogForm newBlog={newBlog} handleBlogChange={handleBlogChange}
        addBlog={addBlog}/>
        {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
      </div>
      }
    </div>
  )
}

export default App