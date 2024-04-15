import { useSelector } from "react-redux";
import { Alert } from "react-bootstrap";

const Notification = () => {
  const notification = useSelector((state) => state.notification);

  const message = notification.message;
  const type = notification.type;

  // const style = {
  //   background: "lightgrey",
  //   fontSize: 20,
  //   borderStyle: "solid",
  //   borderRadius: 5,
  //   padding: 10,
  //   marginBottom: 10,
  // };

  if (message === "" || message === null) {
    //style.display = "none";
    return (
      null
    );
  } else {
    if (type === "success") {
      // const success = {
      //   ...style,
      //   display: "block",
      //   color: "green",
      // };
      return (
        <Alert className="notif" variant="success">
          {message}
        </Alert>
      );
    } else if (type === "error"){
      // const error = {
      //   ...style,
      //   display: "block",
      //   color: "red",
      // };
      return (
        <Alert className="notif" variant="danger">
          {message}
        </Alert>
      );
    }
  }
};

export default Notification;
