// src/api/likes.js
import { post, del } from './client.js';

export const toggleLike = (postId) => 
  post(`posts/${postId}/like`);   // используем POST для toggle