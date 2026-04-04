import { post, put, get } from './client.js';

export const followUser = (userId) => post(`users/${userId}/follow`);
export const unfollowUser = (userId) => post(`users/${userId}/unfollow`);

export const getCurrentUser = () => get('users/me');
export const updateProfile = (data) => put('users/me', data);