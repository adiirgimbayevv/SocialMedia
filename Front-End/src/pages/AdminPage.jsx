import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/client';

const AdminPage = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/admin/posts');
      setPosts(res.data.data || []);
    } catch (err) {
      alert('Ошибка загрузки постов');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId) => {
    const confirmed = window.confirm('Удалить этот пост?');
    if (!confirmed) return;

    try {
      await apiClient.delete(`/posts/${postId}`);
      setPosts(posts.filter(p => p.id !== postId));
    } catch (err) {
      alert('Не удалось удалить пост');
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '60px', color: 'white' }}>Загрузка...</div>;
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '30px' }}>
      {/* Заголовок */}
      <div style={{ 
        background: '#1a1a1a', 
        padding: '25px', 
        borderRadius: '16px', 
        marginBottom: '30px',
        border: '2px solid #ff9900'
      }}>
        <h1 style={{ color: '#ff9900', margin: 0 }}>⚙️ Админ панель</h1>
        <p style={{ color: '#aaa', marginTop: '8px' }}>
          Привет, @{user?.username}! Здесь ты можешь удалять любые посты.
        </p>
        <p style={{ color: '#666', fontSize: '14px' }}>
          Всего постов: <strong style={{ color: 'white' }}>{posts.length}</strong>
        </p>
      </div>

      {/* Список всех постов */}
      {posts.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#888' }}>Постов нет</p>
      ) : (
        posts.map(post => (
          <div 
            key={post.id} 
            style={{
              background: '#1a1a1a',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '15px',
              border: '1px solid #333',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: '15px'
            }}
          >
            {/* Информация о посте */}
            <div style={{ flex: 1 }}>
              <div style={{ marginBottom: '8px' }}>
                <strong style={{ color: '#863bff' }}>@{post.username}</strong>
                <span style={{ color: '#666', fontSize: '13px', marginLeft: '12px' }}>
                  {new Date(post.created_at).toLocaleString('ru-RU')}
                </span>
              </div>
              <p style={{ 
                color: '#ddd', 
                margin: 0, 
                fontSize: '15px',
                lineHeight: '1.5',
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical'
              }}>
                {post.content}
              </p>
            </div>

            {/* Кнопка удаления */}
            <button
              onClick={() => handleDelete(post.id)}
              style={{
                background: '#ff4d4d',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 16px',
                cursor: 'pointer',
                fontSize: '14px',
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}
            >
              🗑 Удалить
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminPage;