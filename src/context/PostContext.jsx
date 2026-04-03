import { createContext, useState, useContext, useEffect } from 'react';
import { AuthContext } from './AuthContext';

export const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({});

  const API_URL = 'http://localhost:3000/api/posts';

  // Получение постов с сервера (с учетом их структуры data и pagination)
  const fetchFeed = async (page = 1) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}?page=${page}&limit=10`);
      if (!response.ok) throw new Error('Server error');
      
      const result = await response.json();
      // У них в контроллере: res.json({ data: result.rows, pagination: ... })
      setPosts(result.data || []); 
      setPagination(result.pagination || {});
    } catch (error) {
      console.error("Could not connect to backend:", error);
      // Если сервак выключен, оставляем пустой список или старые данные
    } finally {
      setLoading(false);
    }
  };

  // Создание поста (отправляем content, как прописано в их createPost)
  const createPost = async (content) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }) 
      });

      if (response.ok) {
        const newPost = await response.json();
        // Добавляем новый пост в начало списка вручную для мгновенного обновления
        setPosts((prev) => [newPost, ...prev]);
      }
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  // Удаление поста (по их роуту deletePost)
  const deletePost = async (postId) => {
    try {
      const response = await fetch(`${API_URL}/${postId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setPosts((prev) => prev.filter(post => post.id !== postId));
      }
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  return (
    <PostContext.Provider value={{ posts, loading, pagination, fetchFeed, createPost, deletePost }}>
      {children}
    </PostContext.Provider>
  );
};