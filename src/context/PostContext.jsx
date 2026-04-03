import { createContext, useState, useEffect } from 'react';
import apiClient from '../api/apiClient';

export const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({});

  const fetchFeed = async (page = 1) => {
    setLoading(true);
    try {
      // Путь /posts, пагинация через query-параметры
      const response = await apiClient.get(`/posts?page=${page}&limit=10`);
      setPosts(response.data.data || []);
      setPagination(response.data.pagination || {});
    } catch (error) {
      console.error("Feed error:", error.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (content) => {
    try {
      // Бэкенд сам возьмет user_id из токена (req.user.id), 
      // так что передаем только content
      const response = await apiClient.post('/posts', { content });
      if (response.status === 201) {
        setPosts((prev) => [response.data, ...prev]);
        return true;
      }
    } catch (error) {
      console.error("Create post error:", error.response?.data?.error);
      alert("Ошибка: " + (error.response?.data?.error || "Не удалось создать пост"));
    }
  };

  const deletePost = async (postId) => {
    try {
      await apiClient.delete(`/posts/${postId}`);
      setPosts((prev) => prev.filter(post => post.id !== postId));
    } catch (error) {
      alert(error.response?.data?.error || "Ошибка удаления");
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