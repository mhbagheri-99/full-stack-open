import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Table } from "react-bootstrap";

const User = () => {
  const id = useParams().id;
  const { users } = useSelector((state) => state.users);
  const user = users.find((user) => user.id === id);
  if (!user) return null;

  return (
    <div>
      <h3>{user.name ? user.name : user.username}</h3>
      <h5>added blogs</h5>
      <Table striped>
        <tbody>
          {user.blogs.map((blog) => (
            <tr key={blog.id}>
              <td>
                {blog.title}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default User;