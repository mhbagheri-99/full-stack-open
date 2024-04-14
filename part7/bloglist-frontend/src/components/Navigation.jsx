import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const navbar = {
  padding: 5,
  backgroundColor: "#f0f0f0",
};

const Navigation = ({ handleLogout }) => {
  const { currentUser } = useSelector(state => state.users);
  return(currentUser ? (
    <div>
      <Link style={navbar} to="/">blogs</Link>
      <Link style={navbar} to="/users">users</Link>
      <span style={navbar}>{currentUser.name ? currentUser.name : currentUser.username} logged in</span>
      <button onClick={handleLogout}>logout</button>
    </div>
  ) : null);
};

export default Navigation;