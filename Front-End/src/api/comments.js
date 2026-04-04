import { get, post, put, del } from './client.js';

export const fetchComments = (postId, page = 1, limit = 10) =>
  get(`posts/${postId}/comments?page=${page}&limit=${limit}`);

export const createComment = (postId, content) =>
  post(`posts/${postId}/comments`, { content });

export const updateComment = (commentId, content) =>
  put(`comments/${commentId}`, { content });

export const deleteComment = (commentId) =>
  del(`comments/${commentId}`);