import { useState } from "react";
import { Form, Button } from "react-bootstrap";

const initialValues = {
  title: "",
  author: "",
  url: "",
};

const BlogForm = ({ addBlog }) => {
  const [newBlog, setNewBlog] = useState(initialValues);

  const handleBlogChange = (e) => {
    const { name, value } = e.target;

    setNewBlog({
      ...newBlog,
      [name]: value,
    });
  };

  const createBlog = (event) => {
    event.preventDefault();
    addBlog(newBlog);
    setNewBlog(initialValues);
  };

  return (
    <div className="formDiv">
      <h2>create new</h2>
      <Form onSubmit={createBlog}>
        <Form.Group>
          <Form.Label>Title:</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={newBlog.title}
            onChange={handleBlogChange}
            placeholder="TITLE"
            id="titleInput"
            data-testid="title"
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Author:</Form.Label>
          <Form.Control
            type="text"
            name="author"
            value={newBlog.author}
            onChange={handleBlogChange}
            placeholder="AUTHOR"
            id="authorInput"
            data-testid="author"
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>URL:</Form.Label>
          <Form.Control
            type="text"
            name="url"
            value={newBlog.url}
            onChange={handleBlogChange}
            placeholder="URL"
            id="urlInput"
            data-testid="url"
          />
        </Form.Group>
        <Button variant="primary" type="submit">save</Button>
      </Form>
    </div>
  );
};

export default BlogForm;
