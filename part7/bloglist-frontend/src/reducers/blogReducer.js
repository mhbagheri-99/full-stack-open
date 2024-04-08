import { createSlice } from "@reduxjs/toolkit";
import blogServices from "../services/blogs";

const blogSlice = createSlice({
  name: "blogs",
  initialState: [],
  reducers: {
    like(state, action) {
      const id = action.payload;
      const blogToChange = state.find(n => n.id === id);
      blogToChange.likes++;
      state.sort((a, b) => b.likes - a.likes);
    },
    appendBlogs(state, action) {
      state.push(action.payload);
    },
    setBlogs(state, action) {
      return action.payload.sort((a, b) => b.likes - a.likes);
    },
    resetBlogs(state) {
      return state = [];
    }
  }
});

export const { like, appendBlogs, setBlogs, resetBlogs } = blogSlice.actions;

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogServices.getAll();
    dispatch(setBlogs(blogs));
  };
};

export const removeBlog = id => {
  return async dispatch => {
    await blogServices.remove(id);
    dispatch(initializeBlogs());
  };
};

export const createBlog = content => {
  return async dispatch => {
    const newBlog = await blogServices.create(content);
    dispatch(appendBlogs(newBlog));
  };
};

export const likeBlog = id => {
  return async dispatch => {
    const state = await blogServices.getAll();
    const blogToChange = state.find(n => n.id === id);
    const updatedBlog = {
      ...blogToChange,
      likes: blogToChange.likes + 1
    };
    await blogServices.update(blogToChange.id, updatedBlog);
    dispatch(like(id));
  };
};

export default blogSlice.reducer;