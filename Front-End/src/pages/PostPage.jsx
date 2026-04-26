import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleLikeAsync } from '../store/postSlice';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx'; 
import apiClient from '../api/client'; 

const PostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { showToast } = useToast();

  // Достаем посты из Redux
  const posts = useSelector((state) => state.posts.items);
  const post = posts.find(p => p.id === parseInt(id));

  // Состояния для редактирования
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post?.content || '');
  const [loading, setLoading] = useState(false);

  // Проверка: хозяин ли я этого поста?
  const isOwnPost = user && post && user.id === post.user_id;

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await apiClient.put(`/posts/${id}/`, { content: editContent });
      
      setIsEditing(false);
      showToast('Пост успешно обновлён!', 'success');
      
      // Чтобы увидеть изменения без перезагрузки, лучше обновить данные в Redux, 
      // но для простоты пока оставим легкую перезагрузку через секунду
      setTimeout(() => window.location.reload(), 1000); 
    } catch (err) {
      showToast('Ошибка при сохранении изменений', 'error');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!post) {
    return <div style={{ padding: '40px', textAlign: 'center', color: '#fff' }}>Пост не найден</div>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <button 
        onClick={() => navigate(-1)} 
        style={{ marginBottom: '20px', background: 'none', color: '#863bff', border: 'none', cursor: 'pointer', fontSize: '16px' }}
      >
        ← Назад
      </button>
      
      <div style={{ background: '#1a1a1a', padding: '25px', borderRadius: '12px', border: '1px solid #333' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ color: '#fff', margin: 0 }}>@{post.username}</h3>
          
          {isOwnPost && !isEditing && (
            <button 
              onClick={() => setIsEditing(true)}
              style={{ background: '#333', color: '#fff', border: 'none', padding: '5px 12px', borderRadius: '8px', cursor: 'pointer' }}
            >
              Изменить
            </button>
          )}
        </div>

        {isEditing ? (
          <div style={{ marginTop: '15px' }}>
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              style={{ 
                width: '100%', 
                minHeight: '100px', 
                background: '#222', 
                color: '#fff', 
                padding: '10px', 
                borderRadius: '8px', 
                border: '1px solid #863bff',
                resize: 'vertical'
              }}
            />
            <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
              <button 
                onClick={handleUpdate} 
                disabled={loading} 
                style={{ background: '#863bff', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '6px', cursor: 'pointer' }}
              >
                {loading ? 'Сохранение...' : 'Сохранить'}
              </button>
              <button 
                onClick={() => setIsEditing(false)} 
                style={{ background: 'transparent', color: '#888', border: 'none', cursor: 'pointer' }}
              >
                Отмена
              </button>
            </div>
          </div>
        ) : (
          <p style={{ fontSize: '18px', lineHeight: '1.6', margin: '20px 0', color: '#eee' }}>
            {post.content}
          </p>
        )}

        <small style={{ color: '#888' }}>
          {new Date(post.created_at).toLocaleString('ru-RU')}
        </small>
      </div>
    </div>
  );
};

export default PostPage;