/* eslint-disable react/no-unescaped-entities */
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";

const Blog = ({ addLike, removeBlog, addComment }) => {
  const blogs = useSelector((state) => state.blogs);
  const id = useParams().id;
  const blog = blogs.find((blog) => blog.id === id);

  const navigate = useNavigate();

  const { currentUser } = useSelector((state) => state.users);

  if (!blog) return null;

  // const authorized = (blog.userID.username === JSON.parse(window.localStorage.getItem('loggedBlogAppUser')).username)
  const authorized = blog.userID.username === currentUser.username;
  const showDeleteButton = { display: authorized ? "" : "none" };

  const likeBlog = () => {
    addLike(blog);
  };

  const deleteBlog = (blog) => {
    removeBlog(blog);
    setTimeout(() => {
      navigate("/");}, 5000);
  };

  const confirmRemove = () => {
    window.confirm(`Remove blog "${blog.title}" by "${blog.author}"?`)
      ? deleteBlog(blog)
      : null;
  };

  const addNewComment = (event) => {
    event.preventDefault();
    const comment = event.target.comment.value;
    event.target.comment.value = "";
    addComment(blog, comment);
  };

  return (
    <div className="blog" data-testid="blog">
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
      <h2>Comments</h2>
      <form onSubmit={addNewComment}>
        <input type="text" name="comment" />
        <button type="submit">Add comment</button>
      </form>
      {(blog.comments.length === 0) ? <p>No comments yet</p>
        :
        <ul>
          {blog.comments.map((comment, index) => (
            <li key={index}>{comment}</li>
          ))}
        </ul>
      }
    </div>
  );
};

export default Blog;
