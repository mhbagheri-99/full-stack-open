/* eslint-disable react/no-unescaped-entities */
import { useState } from "react";

const Blog = ({ blog, currentUser, addLike, removeBlog }, refs) => {
  const [visible, setVisible] = useState(false);

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

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  const likeBlog = () => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
    };
    addLike(updatedBlog);
  };

  const confirmRemove = () => {
    window.confirm(`Remove blog "${blog.title}" by "${blog.author}"?`)
      ? removeBlog(blog)
      : console.log("cancel");
  };

  return (
    <div style={blogStyle} className="blog" data-testid="blog">
      {visible ? (
        <div>
          <p className="title">
            Title: "{blog.title}"
            <button onClick={toggleVisibility}>Show Less</button>
          </p>
          <p className="author">Author: "{blog.author}"</p>
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
      ) : (
        <div>
          <p className="title">
            Title: "{blog.title}"
            <button onClick={toggleVisibility}>Show More</button>
          </p>
          <p className="author">Author: "{blog.author}"</p>
        </div>
      )}
    </div>
  );
};

export default Blog;
