import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as blogApi from "../../api/blogApi";

// GET BLOGS
export const fetchBlogs = createAsyncThunk(
  "blog/fetch",
  async (params, thunkAPI) => {
    try {
      const res = await blogApi.getBlogs(params);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue("Failed to fetch blogs");
    }
  }
);

// CREATE BLOG
export const addBlog = createAsyncThunk(
  "blog/add",
  async (data, thunkAPI) => {
    try {
      const res = await blogApi.createBlog(data);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue("Failed to create blog");
    }
  }
);

// LIKE
export const likeBlog = createAsyncThunk(
  "blog/like",
  async (id, thunkAPI) => {
    try {
      const res = await blogApi.toggleLike(id);
      return { id, data: res.data };
    } catch (err) {
      return thunkAPI.rejectWithValue("Failed to like blog");
    }
  }
);

const blogSlice = createSlice({
  name: "blog",
  initialState: {
    blogs: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      // FETCH BLOGS
      .addCase(fetchBlogs.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = action.payload.blogs || action.payload;
      })
      .addCase(fetchBlogs.rejected, (state) => {
        state.loading = false;
      })

      // CREATE BLOG
      .addCase(addBlog.fulfilled, (state, action) => {
          state.blogs.unshift(action.payload);
      })

      // LIKE
      .addCase(likeBlog.fulfilled, (state, action) => {
        const blog = state.blogs.find(
          (b) => b._id === action.payload.id
        );
        if (blog) {
          blog.likes = action.payload.data.likes;
        }
      });
  },
});

export default blogSlice.reducer;