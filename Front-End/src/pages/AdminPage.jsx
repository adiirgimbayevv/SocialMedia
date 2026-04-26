import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import apiClient from '../api/client';
import Modal from '../components/Modal';

const AdminPage = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [postToDelete, setPostToDelete] = useState(null);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/admin/posts');
      setPosts(res.data.data || []);
    } catch (err) {
      showToast('Ошибка загрузки постов', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Нажали кнопку удалить — запоминаем пост и показываем модалку
  const handleDeleteClick = (post) => {
    setPostToDelete(post);
  };

  // Подтвердили удаление
  const handleDeleteConfirm = async () => {
    try {
      await apiClient.delete(`/posts/${postToDelete.id}`);
      setPosts(posts.filter(p => p.id !== postToDelete.id));
      showToast('Пост удалён', 'success');
    } catch (err) {
      showToast('Не удалось удалить пост', 'error');
    } finally {
      setPostToDelete(null); // закрываем модалку
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '60px', color: 'white' }}>Загрузка...</div>;
  }

  return (
    <>
      {/* Модалка — показывается только если выбран пост для удаления */}
      {postToDelete && (
        <Modal
          message={`Удалить пост от @${postToDelete.username}?`}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setPostToDelete(null)}
          confirmText='Delete'
        />
      )}

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '30px' }}>
        <div style={{ background: '#1a1a1a', padding: '25px', borderRadius: '16px', marginBottom: '30px', border: '2px solid #ff9900' }}>
          <h1 style={{ color: '#ff9900', margin: 0 }}>⚙️ Админ панель</h1>
          <p style={{ color: '#aaa', marginTop: '8px' }}>
            Привет, @{user?.username}! Здесь ты можешь удалять любые посты.
          </p>
          <p style={{ color: '#666', fontSize: '14px' }}>
            Всего постов: <strong style={{ color: 'white' }}>{posts.length}</strong>
          </p>
        </div>

        {posts.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#888' }}>Постов нет</p>
        ) : (
          posts.map(post => (
            <div
              key={post.id}
              style={{ background: '#1a1a1a', borderRadius: '12px', padding: '20px', marginBottom: '15px', border: '1px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '15px' }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ marginBottom: '8px' }}>
                  <strong style={{ color: '#863bff' }}>@{post.username}</strong>
                  <span style={{ color: '#666', fontSize: '13px', marginLeft: '12px' }}>
                    {new Date(post.created_at).toLocaleString('ru-RU')}
                  </span>
                </div>
                <p style={{ color: '#ddd', margin: 0, fontSize: '15px', lineHeight: '1.5' }}>
                  {post.content}
                </p>
              </div>

              <button
                onClick={() => handleDeleteClick(post)}
                style={{ background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 16px', cursor: 'pointer', fontSize: '14px', whiteSpace: 'nowrap', flexShrink: 0 }}
              >
                🗑 Удалить
              </button>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default AdminPage;