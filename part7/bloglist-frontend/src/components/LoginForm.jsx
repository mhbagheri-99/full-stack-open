import PropTypes from "prop-types";
import { Form, Button } from "react-bootstrap";

const LoginForm = ({
  handleLogin,
  username,
  setUsername,
  password,
  setPassword,
}) => {
  LoginForm.propTypes = {
    handleLogin: PropTypes.func.isRequired,
    setUsername: PropTypes.func.isRequired,
    setPassword: PropTypes.func.isRequired,
    username: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
  };

  return (
    <Form onSubmit={handleLogin}>
      <Form.Group>
        <Form.Label>Username:</Form.Label>
        <Form.Control
          type="text"
          value={username}
          name="Username"
          data-testid="username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Password:</Form.Label>
        <Form.Control
          type="password"
          value={password}
          name="Password"
          data-testid="password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </Form.Group>
      <Button variant="primary" type="submit">login</Button>
    </Form>
  );
};

export default LoginForm;
