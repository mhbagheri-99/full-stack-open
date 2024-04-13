import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Blogs = () => {
  const blogs = useSelector((state) => state.blogs);

  const blogStyle = {
    padding: 8,
    border: "solid",
    borderWidth: 1,
  };

  return (
    <div>
      {blogs.map((blog) => (
        <p key={blog.id} style={blogStyle}>
          <Link to={`/blogs/${blog.id}`}>
            {blog.title}
          </Link>
        </p>
      ))}
    </div>
  );
};

export default Blogs;