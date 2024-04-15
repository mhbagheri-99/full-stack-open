import { useState, useEffect, useRef } from "react";
import {
  BrowserRouter as Router,
  Routes, Route, Link,
  useParams, useNavigate,
} from "react-router-dom";

import Blog from "./components/Blog";
import Blogs from "./components/Blogs";
import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm";
import BlogForm from "./components/BlogForm";
import Togglable from "./components/Togglable";
import Navigation from "./components/Navigation";
import Home from "./components/Home";
import Users from "./components/Users";
import User from "./components/User";
import blogService from "./services/blogs";
import loginService from "./services/login";


import { useSelector, useDispatch } from "react-redux";
import { notify } from "./reducers/notificationReducer";
import { initializeBlogs, createBlog, removeBlog, likeBlog, resetBlogs, addComment } from "./reducers/blogReducer";
import { initializeUsers, setCurrentUserAction } from "./reducers/userReducer";

const App = () => {
  // const blogs = useSelector((state) => state.blogs);
  const [rerender, setRerender] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { users, currentUser } = useSelector((state) => state.users);

  const blogFormRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
    setTimeout(navigate("/"), 5000);
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

  const addNewComment = (blog, comment) => {
    const updatedBlog = {
      ...blog,
      comments: blog.comments.concat(comment),
    };
    dispatch(addComment(blog, comment));
    setRerender(!rerender);
    dispatch(notify({
      message: `Comment added to "${blog.title}" by "${blog.author}"`,
      type: "success",
    }, 5));
  };

  return (
    <div className="container">
      <Navigation handleLogout={handleLogout}/>
      <div>
        <h1>Blogs App</h1>
        <Notification />
      </div>
      <Routes>
        <Route path="/" element={
          <Home blogFormRef={blogFormRef} addBlog={addBlog} handleLogin={handleLogin} username={username}
            setUsername={setUsername} password={password} setPassword={setPassword}/>
        } />
        <Route path="/blogs/:id" element={
          <Blog addLike={addLike} removeBlog={deleteBlog} addComment={addNewComment}/>}
        />
        <Route path="/users" element={<Users />} />
        <Route path="/users/:id" element={<User />} />
      </Routes>
    </div>
  );
};

export default App;
