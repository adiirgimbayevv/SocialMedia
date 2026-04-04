import { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import * as postApi from '../api/posts';

const PostContext = createContext();

export function PostProvider({ children }) {
  const { token } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });

  const fetchFeed = async (page = 1) => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await postApi.fetchPosts(page);
      setPosts(res.data.data || []);
      setPagination(res.data.pagination || { currentPage: page, totalPages: 1 });
    } catch (err) {
      console.error('Ошибка загрузки ленты', err);
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (content) => {
    try {
      await postApi.createPost(content);
      fetchFeed(1); // обновляем ленту
    } catch (err) {
      alert('Не удалось создать пост');
    }
  };

  const deletePost = async (id) => {
    if (!window.confirm('Удалить пост?')) return;
    try {
      await postApi.deletePost(id);
      fetchFeed(pagination.currentPage);
    } catch (err) {
      alert('Не удалось удалить');
    }
  };

  useEffect(() => {
    if (token) fetchFeed(1);
  }, [token]);

  return (
    <PostContext.Provider value={{ posts, loading, pagination, fetchFeed, createPost, deletePost }}>
      {children}
    </PostContext.Provider>
  );
}

export const usePost = () => useContext(PostContext);