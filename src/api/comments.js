import { get, post, put, del } from './client.js'
 
export const fetchComments   = (token, postId, page = 1, limit = 20) =>
  get(`posts/${postId}/comments?page=${page}&limit=${limit}`, token)
 
export const createComment   = (token, postId, content) =>
  post(`posts/${postId}/comments`, { content }, token)
 
export const updateComment   = (token, id, content) =>
  put(`comments/${id}`, { content }, token)
 
export const deleteComment   = (token, id) =>
  del(`comments/${id}`, token)
 