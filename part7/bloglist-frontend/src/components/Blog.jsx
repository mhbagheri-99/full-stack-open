/* eslint-disable react/no-unescaped-entities */
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const Blog = ({ addLike, removeBlog }) => {
  const blogs = useSelector((state) => state.blogs);
  const id = useParams().id;
  const blog = blogs.find((blog) => blog.id === id);

  const { currentUser } = useSelector((state) => state.users);

  if (!blog) return null;

  // const authorized = (blog.userID.username === JSON.parse(window.localStorage.getItem('loggedBlogAppUser')).username)
  const authorized = blog.userID.username === currentUser.username;
  const showDeleteButton = { display: authorized ? "" : "none" };

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const likeBlog = () => {
    addLike(blog);
  };

  const confirmRemove = () => {
    window.confirm(`Remove blog "${blog.title}" by "${blog.author}"?`)
      ? removeBlog(blog)
      : console.log("cancel");
  };

  return (
    <div style={blogStyle} className="blog" data-testid="blog">
      <h1 className="title">
        {blog.title}
      </h1>
      <h2 className="author">
        By {blog.author}
      </h2>
      <p className="likes">
            Likes: {blog.likes}
        <button onClick={likeBlog}>like</button>
      </p>
      <p className="url">URL: "{blog.url}"</p>
      <p className="user">
            Added by: "
        {blog.userID.name ? blog.userID.name : blog.userID.username}"
      </p>
      <button style={showDeleteButton} onClick={confirmRemove}>
            Remove
      </button>
    </div>
  );
};

export default Blog;
