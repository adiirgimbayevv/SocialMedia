import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as postApi from '../api/posts';
import apiClient from '../api/client';

// Загрузить посты
export const fetchPosts = createAsyncThunk('posts/fetchPosts', async (page) => {
  const response = await postApi.fetchPosts(page);
  return response.data;
});


export const addPostAsync = createAsyncThunk('posts/addPost', async (content, { getState }) => {
  const res = await apiClient.post('/posts', { content });
  
  const newPost = res.data.post || res.data.data || res.data;
  
  // Берём данные текущего юзера из Redux/localStorage
  // чтобы сразу показать аватарку и никнейм
  const user = JSON.parse(localStorage.getItem('user'));
  
  return {
    ...newPost,
    username: newPost.username || user?.username,
    user_id: newPost.user_id || user?.id,
    likes_count: 0,
    liked_by_user: false,
  };
});

// Удалить пост
export const deletePostAsync = createAsyncThunk('posts/deletePost', async (postId) => {
  await apiClient.delete(`/posts/${postId}`);
  return postId;
});

// Лайк
export const toggleLikeAsync = createAsyncThunk('posts/toggleLike', async (postId) => {
  const res = await apiClient.post(`/posts/${postId}/like`);
  return { postId, liked: res.data.liked, likes_count: res.data.likes_count };
});

const postSlice = createSlice({
  name: 'posts',
  initialState: { items: [], pagination: {}, loading: false },
  reducers: {
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
        state.items = action.payload.data || [];
        state.pagination = action.payload.pagination || {};
      })
      .addCase(fetchPosts.rejected, (state) => { state.loading = false; })

      .addCase(addPostAsync.fulfilled, (state, action) => {
        if (action.payload) state.items.unshift(action.payload);
      })

      .addCase(deletePostAsync.fulfilled, (state, action) => {
        state.items = state.items.filter(post => post.id !== action.payload);
      })

      .addCase(toggleLikeAsync.fulfilled, (state, action) => {
        const { postId, liked, likes_count } = action.payload;
        const post = state.items.find(p => p.id === postId);
        if (post) {
          post.liked_by_user = liked;
          post.likes_count = likes_count;
        }
      });
  }
});

export const { optimisticLike } = postSlice.actions;
export default postSlice.reducer;