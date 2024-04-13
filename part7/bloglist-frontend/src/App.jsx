import { useState, useEffect, useRef } from "react";
import {
  BrowserRouter as Router,
  Routes, Route, Link,
  useParams
} from "react-router-dom";

import Blog from "./components/Blog";
import Blogs from "./components/Blogs";
import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm";
import BlogForm from "./components/BlogForm";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Togglable from "./components/Togglable";

import { useSelector, useDispatch } from "react-redux";
import { notify } from "./reducers/notificationReducer";
import { initializeBlogs, createBlog, removeBlog, likeBlog, resetBlogs } from "./reducers/blogReducer";
import { initializeUsers, setCurrentUserAction } from "./reducers/userReducer";

const App = () => {
  // const blogs = useSelector((state) => state.blogs);
  const [rerender, setRerender] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { users, currentUser } = useSelector((state) => state.users);

  const blogFormRef = useRef();
  const dispatch = useDispatch();

  // check the expired token case as well
  useEffect(() => {
    if (currentUser)
      dispatch(initializeBlogs());
  }, [currentUser, rerender, dispatch]);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogAppUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      dispatch(setCurrentUserAction(user));
      dispatch(initializeUsers());
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });
      window.localStorage.setItem("loggedBlogAppUser", JSON.stringify(user));
      blogService.setToken(user.token);
      dispatch(setCurrentUserAction(user));
      dispatch(notify({
        message: `Welcome ${user.name ? user.name : user.username}!`,
        type: "success",
      }, 5));
      setUsername("");
      setPassword("");
    } catch (exception) {
      dispatch(notify({
        message: "Wrong credentials",
        type: "error",
      }, 5));
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogAppUser");
    dispatch(notify({
      message: `${currentUser.name ? currentUser.name : currentUser.username} successfully logged out!`,
      type: "success",
    }, 5));
    dispatch(setCurrentUserAction(null));
    dispatch(resetBlogs());
  };

  const addBlog = (blog) => {
    blogFormRef.current.toggleVisibility();
    const newBlog = {
      ...blog,
      likes: 0,
      userID: currentUser.id,
    };
    dispatch(createBlog(newBlog));
    setRerender(!rerender);
    dispatch(notify({
      message: `Blog "${newBlog.title}" by "${newBlog.author}" added`,
      type: "success",
    }, 5));
  };

  const addLike = (likedBlog) => {
    dispatch(likeBlog(likedBlog.id));
    setRerender(!rerender);
    dispatch(notify({
      message: `Liked "${likedBlog.title}" by "${likedBlog.author}"`,
      type: "success",
    }, 5));
  };

  const deleteBlog = (blog) => {
    dispatch(removeBlog(blog.id));
    dispatch(notify({
      message: `Removed "${blog.title}" by "${blog.author}"`,
      type: "success",
    }, 5));
  };

  const padding = {
    padding: 5
  };

  const Home = () => (
    <div>
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm addBlog={addBlog} />
      </Togglable>
      <Blogs />
    </div>
  );

  const Users = () => (
    <div>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <Link to={`/users/${user.id}`}>
                  {user.name ? user.name : user.username}
                </Link>
              </td>
              <td>{user.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const User = () => {
    const id = useParams().id;
    const user = users.find((user) => user.id === id);
    if (!user) return null;

    return (
      <div>
        <h2>{user.name ? user.name : user.username}</h2>
        <h3>added blogs</h3>
        <ul>
          {user.blogs.map((blog) => (
            <li key={blog.id}>{blog.title}</li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <Router>
      <div>
        <Link style={padding} to="/">home</Link>
        <Link style={padding} to="/blogs">blogs</Link>
        <Link style={padding} to="/users">users</Link>
      </div>
      <div>
        <h2>blogs</h2>
        <Notification />
        {currentUser === null ? (
          <LoginForm
            handleLogin={handleLogin}
            username={username}
            setUsername={setUsername}
            password={password}
            setPassword={setPassword}
          />
        ) : (
          <div>
            <p>
              {currentUser.name ? currentUser.name : currentUser.username} logged-in
              <button onClick={handleLogout}>Logout</button>{" "}
            </p>
          </div>
        )}
      </div>

      <Routes>
        <Route path="/blogs" element={<Home />} />
        <Route path="/blogs/:id" element={
          <Blog addLike={addLike} removeBlog={deleteBlog}/>}
        />
        <Route path="/users" element={<Users />} />
        <Route path="/users/:id" element={<User />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default App;
