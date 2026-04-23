import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as postApi from '../api/posts';
import { toggleLike } from '../api/likes';

// Асинхронные экшены
export const fetchPosts = createAsyncThunk('posts/fetchPosts', async (page) => {
  const response = await postApi.fetchPosts(page);
  return response.data;
});

const postSlice = createSlice({
  name: 'posts',
  initialState: { items: [], pagination: {}, loading: false },
  reducers: {
    // Оптимистичный лайк (как у тебя в контексте)
    optimisticLike: (state, action) => {
      const post = state.items.find(p => p.id === action.payload);
      if (post) {
        const wasLiked = post.liked_by_user;
        post.liked_by_user = !wasLiked;
        post.likes_count = wasLiked ? post.likes_count - 1 : post.likes_count + 1;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => { state.loading = true; })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchPosts.rejected, (state) => { state.loading = false; });
  }
});

export const { optimisticLike } = postSlice.actions;
export default postSlice.reducer;