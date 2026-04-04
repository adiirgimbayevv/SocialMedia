// src/api/follow.js
import { get } from './client.js';

export const getMyFollowing = () => get('users/me/following');
export const getMyFollowers = () => get('users/me/followers');