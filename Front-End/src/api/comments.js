import { get, post, put, del } from './client.js';

export const fetchComments = (postId, page = 1, limit = 20) =>
  get(`posts/${postId}/comments?page=${page}&limit=${limit}`);

export const createComment = (postId, content) =>
  post(`posts/${postId}/comments`, { content });

export const updateComment = (id, content) => put(`comments/${id}`, { content });

export const deleteComment = (id) => del(`comments/${id}`);