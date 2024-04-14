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
    comment(state, action) {
      const id = action.payload.id;
      const blogToChange = state.find(n => n.id === id);
      blogToChange.comments.push(action.payload.comment);
    },
    // appendBlogs(state, action) {
    //   return state.concat(action.payload);
    // },
    setBlogs(state, action) {
      return action.payload.sort((a, b) => b.likes - a.likes);
    },
    getBlogs(state) {
      return state;
    },
    resetBlogs(state) {
      return state = [];
    }
  }
});

export const { like, comment, setBlogs, getBlogs, resetBlogs } = blogSlice.actions;

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
    await blogServices.create(content);
    dispatch(initializeBlogs());
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

export const addComment = (blog, newComment) => {
  return async dispatch => {
    const updatedBlog = {
      ...blog,
      comments: blog.comments.concat(newComment)
    };
    await blogServices.addComment(blog.id, newComment);
    dispatch(comment({ id:blog.id, comment:newComment }));
  };
};

export default blogSlice.reducer;