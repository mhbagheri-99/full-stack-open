import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm";
import BlogForm from "./components/BlogForm";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Togglable from "./components/Togglable";

import { useSelector, useDispatch } from "react-redux";
import { notify } from "./reducers/notificationReducer";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [rerender, setRerender] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  const blogFormRef = useRef();
  const dispatch = useDispatch();

  // check the expired token case as well
  useEffect(() => {
    if (user)
      blogService
        .getAll()
        .then((blogs) => setBlogs(blogs.sort((a, b) => b.likes - a.likes)));
  }, [user, rerender]);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogAppUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
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
      setUser(user);
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
      message: `${user.name ? user.name : user.username} successfully logged out!`,
      type: "success",
    }, 5));
    setUser(null);
    setBlogs([]); // doesn't work???
  };

  const addBlog = (newBlog) => {
    blogFormRef.current.toggleVisibility();
    blogService.create(newBlog).then((returnedBlog) => {
      setBlogs(blogs.concat(returnedBlog));
      setRerender(!rerender);
      dispatch(notify({
        message: `Blog "${newBlog.title}" by "${newBlog.author}" added`,
        type: "success",
      }, 5));
    });
  };

  const addLike = (blog) => {
    blogService.update(blog.id, blog).then((returnedBlog) => {
      setBlogs(blogs.map((b) => (b.id !== blog.id ? b : returnedBlog)));
      setRerender(!rerender);
      dispatch(notify({
        message: `Liked "${blog.title}" by "${blog.author}"`,
        type: "success",
      }, 5));
    });
  };

  const removeBlog = (blog) => {
    blogService.remove(blog.id).then(() => {
      setBlogs(blogs.filter((b) => b.id !== blog.id));
      dispatch(notify({
        message: `Removed "${blog.title}" by "${blog.author}"`,
        type: "success",
      }, 5));
    });
  };

  return (
    <div>
      <h2>blogs</h2>
      <Notification />
      {user === null ? (
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
            {user.name ? user.name : user.username} logged-in
            <button onClick={handleLogout}>Logout</button>{" "}
          </p>
          <Togglable buttonLabel="new blog" ref={blogFormRef}>
            <BlogForm addBlog={addBlog} />
          </Togglable>
          {blogs.map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              currentUser={user}
              addLike={addLike}
              removeBlog={removeBlog}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
