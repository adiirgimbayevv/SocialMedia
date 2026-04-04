import { get, post, put, del } from './client.js';

export const fetchPosts = (page = 1, limit = 6) =>
  get(`posts?page=${page}&limit=${limit}`);

export const fetchPostById = (id) => get(`posts/${id}`);

export const createPost = (content) => post('posts', { content });

export const updatePost = (id, content) => put(`posts/${id}`, { content });

export const deletePost = (id) => del(`posts/${id}`);