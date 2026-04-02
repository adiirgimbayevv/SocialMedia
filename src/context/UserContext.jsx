// src/contexts/UserContext.jsx
import { createContext, useContext, useState } from 'react';
import apiClient from '../api/apiClient';

export const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [following, setFollowing] = useState([]);

  const toggleFollow = async (userId) => {
    try {
      if (following.includes(userId)) {
        await apiClient.post(`/users/${userId}/unfollow`);
        setFollowing(prev => prev.filter(id => id !== userId));
      } else {
        await apiClient.post(`/users/${userId}/follow`);
        setFollowing(prev => [...prev, userId]);
      }
    } catch (err) {
      console.error(err);
      alert('Ошибка при подписке');
    }
  };

  const isFollowing = (userId) => following.includes(userId);

  return (
    <UserContext.Provider value={{ following, toggleFollow, isFollowing }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;