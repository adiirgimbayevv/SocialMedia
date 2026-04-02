import { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // Список ID пользователей, на которых мы подписаны
  const [following, setFollowing] = useState([]);

  // Функция Подписаться/Отписаться
  const toggleFollow = (userId) => {
    if (following.includes(userId)) {
      // Если уже подписаны — удаляем из списка
      setFollowing(prev => prev.filter(id => id !== userId));
      console.log(`Unfollowed user: ${userId}`);
    } else {
      // Если не подписаны — добавляем
      setFollowing(prev => [...prev, userId]);
      console.log(`Followed user: ${userId}`);
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