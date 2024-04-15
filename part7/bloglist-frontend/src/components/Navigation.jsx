import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Navbar, Nav, Button } from "react-bootstrap";

const navbar = {
  padding: 4,
  color: "white",
};

const Navigation = ({ handleLogout }) => {
  const { currentUser } = useSelector(state => state.users);
  return(currentUser ? (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link href="#" as="span">
            <Link style={navbar} to="/">blogs</Link>
          </Nav.Link>
          <Nav.Link href="#" as="span">
            <Link style={navbar} to="/users">users</Link>
          </Nav.Link>
          <em style={navbar}>{currentUser.name ? currentUser.name : currentUser.username} logged in</em>
          <Button variant="secondary" onClick={handleLogout}>logout</Button>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  ) : null);
};

export default Navigation;