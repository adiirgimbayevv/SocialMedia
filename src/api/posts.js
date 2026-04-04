import { get, post, put, del } from './client.js'
 
export const fetchPosts     = (token, page = 1, limit = 6) =>
  get(`posts?page=${page}&limit=${limit}`, token)
 
export const fetchPostById  = (token, id) =>
  get(`posts/${id}`, token)
 
export const createPost     = (token, content) =>
  post('posts', { content }, token)
 
export const updatePost     = (token, id, content) =>
  put(`posts/${id}`, { content }, token)
 
export const deletePost     = (token, id) =>
  del(`posts/${id}`, token)
 