import { createContext, useState, useContext, useEffect } from 'react';
import { AuthContext } from './AuthContext';

export const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({});

  const API_URL = 'http://localhost:3000/api/posts';

  // Получение ленты постов
  const fetchFeed = async (page = 1) => {
    setLoading(true);
    try {
      console.log(`Запрос постов с: ${API_URL}?page=${page}`);
      const response = await fetch(`${API_URL}?page=${page}&limit=10`);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Сервер вернул ошибку:", errorData.message || response.statusText);
        return;
      }
      
      const result = await response.json();
      console.log("Данные от сервера получены:", result);
      
      // У пацанов данные лежат в result.data
      setPosts(result.data || []); 
      setPagination(result.pagination || {});
    } catch (error) {
      console.error("Критическая ошибка: Сервер на порту 3000 недоступен. Проверьте запущен ли Back-End!");
    } finally {
      setLoading(false);
    }
  };

  // Создание нового поста
  const createPost = async (content) => {
    if (!user) {
      alert("Ошибка: Вы не авторизованы! user is undefined.");
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          content,
          user_id: user.id // Передаем ID текущего юзера
        }) 
      });

      if (response.ok) {
        const newPost = await response.json();
        console.log("Пост успешно создан в БД:", newPost);
        // Добавляем пост в список и обновляем ленту
        setPosts((prev) => [newPost, ...prev]);
        return true;
      } else {
        const err = await response.json();
        console.error("Ошибка при создании поста:", err);
      }
    } catch (error) {
      console.error("Не удалось отправить пост на сервер:", error);
    }
  };

  // Удаление поста
  const deletePost = async (postId) => {
    try {
      const response = await fetch(`${API_URL}/${postId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        console.log(`Пост ${postId} удален`);
        setPosts((prev) => prev.filter(post => post.id !== postId));
      } else {
        console.error("Ошибка при удалении поста");
      }
    } catch (error) {
      console.error("Запрос на удаление не дошел до сервера:", error);
    }
  };

  // Загружаем посты при первой загрузке приложения
  useEffect(() => {
    fetchFeed();
  }, []);

  return (
    <PostContext.Provider value={{ posts, loading, pagination, fetchFeed, createPost, deletePost }}>
      {children}
    </PostContext.Provider>
  );
};