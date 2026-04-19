import { post } from './client.js';

export const toggleLike = (postId) => 
  post(`posts/${postId}/like`);   