import Blog from "./Blog";
import { useSelector } from "react-redux";

const Blogs = ({ user, addLike, removeBlog }) => {
  const blogs = useSelector((state) => state.blogs);

  return(
    blogs.map((blog) => (
      <Blog
        key={blog.id}
        blog={blog}
        currentUser={user}
        addLike={addLike}
        removeBlog={removeBlog}
      />
    ))
  );
};

export default Blogs;