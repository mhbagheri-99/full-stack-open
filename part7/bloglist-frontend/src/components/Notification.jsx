import { useSelector } from "react-redux";

const Notification = () => {
  const notification = useSelector((state) => state.notification);

  const message = notification.message;
  const type = notification.type;

  const style = {
    background: "lightgrey",
    fontSize: 20,
    borderStyle: "solid",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  };

  if (message === "" || message === null) {
    style.display = "none";
    return (
      <div style={style}>
        {notification.message}
      </div>
    );
  } else {
    if (type === "success") {
      const success = {
        ...style,
        display: "block",
        color: "green",
      };
      return (
        <div className="notif" style={success}>
          {message}
        </div>
      );
    } else if (type === "error"){
      const error = {
        ...style,
        display: "block",
        color: "red",
      };
      return (
        <div className="notif" style={error}>
          {message}
        </div>
      );
    }
  }
};

export default Notification;
