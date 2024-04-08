import { createSlice } from "@reduxjs/toolkit";
import userServices from "../services/users";

const userSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
    currentUser: null
  },
  reducers: {
    // appendUsers(state, action) {
    //   state.push(action.payload);
    // },
    setUsers(state, action) {
      return { ...state, users: action.payload };
    },
    setCurrentUser(state, action) {
      return { ...state, currentUser: action.payload };
    },
  }
});

export const { setUsers, setCurrentUser } = userSlice.actions;

export const initializeUsers = () => {
  return async dispatch => {
    const allUsers = await userServices.getAll();
    dispatch(setUsers(allUsers));
  };
};

export const setCurrentUserAction = (user) => {
  return async dispatch => {
    dispatch(setCurrentUser(user));
  };
};

export default userSlice.reducer;