import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: { message: "", type: "" },
  reducers: {
    setNotification(state, action) {
      return action.payload;
    },
    removeNotification(state) {
      return { message: "", type: "" };
    }
  }
});

export const { setNotification, removeNotification } = notificationSlice.actions;

export const notify = (message, time) => {
  return async dispatch => {
    dispatch(setNotification(message));
    setTimeout(() => {
      dispatch(removeNotification());
    }, time * 1000);
  };
};

export default notificationSlice.reducer;