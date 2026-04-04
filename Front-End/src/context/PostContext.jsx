// src/context/PostContext.jsx
import { createContext, useState, useContext, useEffect } from 'react';
import * as postApi from '../api/posts';
import { toggleLike } from '../api/likes';

const PostContext = createContext();

export function PostProvider({ children }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });

  const fetchFeed = async (page = 1) => {
    setLoading(true);
    try {
      const res = await postApi.fetchPosts(page);
      setPosts(res.data.data || []);
      setPagination(res.data.pagination || { currentPage: page, totalPages: 1 });
    } catch (err) {
      console.error('Ошибка загрузки ленты:', err);
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (content) => {
    try {
      await postApi.createPost(content);
      fetchFeed(1);
    } catch (err) {
      alert('Не удалось создать пост');
    }
  };

  const deletePost = async (id) => {
    try {
      await postApi.deletePost(id);
      fetchFeed(pagination.currentPage);
    } catch (err) {
      alert('Не удалось удалить пост');
    }
  };

  const handleLike = async (postId) => {
    // Находим текущий пост
    const currentPost = posts.find(p => p.id === postId);
    if (!currentPost) return;

    const wasLiked = currentPost.liked_by_user || false;
    const currentCount = currentPost.likes_count || 0;

    // Оптимистичное обновление (сразу меняем UI)
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? {
              ...post,
              liked_by_user: !wasLiked,
              likes_count: wasLiked ? currentCount - 1 : currentCount + 1
            }
          : post
      )
    );

    try {
      // Отправляем запрос на сервер
      const response = await toggleLike(postId);
      
      // Обновляем точными данными с сервера (на случай расхождений)
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId
            ? {
                ...post,
                liked_by_user: response.data.liked,
                likes_count: response.data.likes_count
              }
            : post
        )
      );
    } catch (err) {
      console.error('Ошибка лайка:', err);
      // Откатываем оптимистичное обновление при ошибке
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId
            ? {
                ...post,
                liked_by_user: wasLiked,
                likes_count: currentCount
              }
            : post
        )
      );
      alert('Не удалось поставить лайк');
    }
  };

  useEffect(() => {
    fetchFeed(1);
  }, []);

  return (
    <PostContext.Provider value={{
      posts,
      loading,
      pagination,
      fetchFeed,
      createPost,
      deletePost,
      handleLike
    }}>
      {children}
    </PostContext.Provider>
  );
}

export const usePost = () => useContext(PostContext);