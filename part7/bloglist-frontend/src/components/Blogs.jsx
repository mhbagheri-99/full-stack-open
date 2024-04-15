import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Table } from "react-bootstrap";

const Blogs = () => {
  const blogs = useSelector((state) => state.blogs);

  // const blogStyle = {
  //   padding: 8,
  //   border: "solid",
  //   borderWidth: 1,
  // };

  return (
    <div>
      <Table striped>
        <tbody>
          {blogs.map((blog) => (
            <tr key={blog.id}>
              <td>
                <Link to={`/blogs/${blog.id}`}>
                  {blog.title}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Blogs;