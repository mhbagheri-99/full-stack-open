import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [rerender, setRerender] = useState(false)

  const [errorMessage, setErrorMessage] = useState(null)
  // False means success, true means error
  const [errorType, setErrorType] = useState(null)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const blogFormRef = useRef()

  // check the expired token case as well
  useEffect(() => {
    if (user)
      blogService.getAll().then(blogs =>
        setBlogs( blogs.sort ((a, b) => b.likes - a.likes))
      )
  }, [user, rerender])

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

  const addBlog = (newBlog) => {
    blogFormRef.current.toggleVisibility()
    blogService
      .create(newBlog)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setRerender(!rerender)
        setErrorType(false)
        setErrorMessage(`Blog "${newBlog.title}" by "${newBlog.author}" added`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
  }

  const addLike = (blog) => {
    blogService
      .update(blog.id, blog)
      .then(returnedBlog => {
        setBlogs(blogs.map(b => b.id !== blog.id ? b : returnedBlog))
        setRerender(!rerender)
        setErrorType(false)
        setErrorMessage(`Liked "${blog.title}" by "${blog.author}"`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
  }

  const removeBlog = (blog) => {
    blogService
      .remove(blog.id)
      .then(() => {
        setBlogs(blogs.filter(b => b.id !== blog.id))
        setErrorType(false)
        setErrorMessage(`Removed "${blog.title}" by "${blog.author}"`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
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
          <Togglable buttonLabel="new blog" ref={blogFormRef}>
            <BlogForm addBlog={addBlog}/>
          </Togglable>
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} currentUser={user}
              addLike={addLike} removeBlog={removeBlog}/>
          )}
        </div>
      }
    </div>
  )
}

export default App