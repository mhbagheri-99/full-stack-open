import { useSelector } from "react-redux";
import Togglable from "./Togglable";
import BlogForm from "./BlogForm";
import Blogs from "./Blogs";
import LoginForm from "./LoginForm";

const Home = ({ blogFormRef, addBlog, handleLogin, username, setUsername, password, setPassword }) => {
  const { currentUser } = useSelector(state => state.users);
  return(currentUser ?
    <div>
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm addBlog={addBlog} />
      </Togglable>
      <Blogs />
    </div>
    :
    <LoginForm
      handleLogin={handleLogin}
      username={username}
      setUsername={setUsername}
      password={password}
      setPassword={setPassword}
    />
  );
};

export default Home;