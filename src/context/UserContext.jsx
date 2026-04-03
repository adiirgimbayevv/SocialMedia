import { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [following, setFollowing] = useState([]);

const toggleFollow = async (userId) => {
  try {
    const isCurrentlyFollowing = following.includes(userId);
    const endpoint = isCurrentlyFollowing ? `/users/${userId}/unfollow` : `/users/${userId}/follow`;
    
    await apiClient.post(endpoint); // Отправляем на бэк

    if (isCurrentlyFollowing) {
      setFollowing(prev => prev.filter(id => id !== userId));
    } else {
      setFollowing(prev => [...prev, userId]);
    }
  } catch (error) {
    console.error("Follow error:", error);
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