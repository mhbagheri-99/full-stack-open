import { useState, forwardRef, useImperativeHandle } from "react";
import { Button } from "react-bootstrap";
import PropTypes from "prop-types";

const Togglable = forwardRef((props, refs) => {
  const [visible, setVisible] = useState(false);

  const hideWhenVisible = { display: visible ? "none" : "" };
  const showWhenVisible = { display: visible ? "" : "none" };

  Togglable.propTypes = {
    buttonLabel: PropTypes.string.isRequired,
  };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  useImperativeHandle(refs, () => {
    return {
      toggleVisibility,
    };
  });

  return (
    <div>
      <div style={hideWhenVisible}>
        <Button variant="secondary" onClick={toggleVisibility}>{props.buttonLabel}</Button>
      </div>
      <div style={showWhenVisible} className="togglableContent">
        {props.children}
        <Button variant="secondary" onClick={toggleVisibility}>cancel</Button>
      </div>
    </div>
  );
});

Togglable.displayName = "Togglable";

export default Togglable;
