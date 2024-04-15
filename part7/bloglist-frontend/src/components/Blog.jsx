/* eslint-disable react/no-unescaped-entities */
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { Table, Form, Button } from "react-bootstrap";

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
        <Button variant="secondary" onClick={likeBlog}>like</Button>
      </p>
      <p className="url"> URL: <a className="url"> {blog.url} </a> </p>
      <p className="user">
            Added by: "
        {blog.userID.name ? blog.userID.name : blog.userID.username}"
      </p>
      <Button variant="secondary" style={showDeleteButton} onClick={confirmRemove}>
            Remove
      </Button>
      <h2>Comments</h2>
      <Form onSubmit={addNewComment}>
        <Form.Group>
          <Form.Control type="text" name="comment" />
          <Button variant="primary" type="submit">Add comment</Button>
        </Form.Group>
      </Form>
      {(blog.comments.length === 0) ? <p>No comments yet</p>
        :
        <Table striped>
          <tbody>
            {blog.comments.map((comment, index) => (
              <tr key={index}>
                <td>
                  {comment}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      }
    </div>
  );
};

export default Blog;
