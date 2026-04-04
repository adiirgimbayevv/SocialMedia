import { useContext, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';     // ← исправлено
import { usePost } from '../context/PostContext.jsx';     // ← используем usePost

const FeedPage = () => {
  const { user } = useAuth();
  const { posts, loading, createPost, deletePost, pagination, fetchFeed } = usePost();

  const [newContent, setNewContent] = useState('');

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newContent.trim()) return;
    
    await createPost(newContent);
    setNewContent('');
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '80px' }}>Загрузка ленты...</div>;
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      {/* Форма создания поста */}
      <form onSubmit={handleCreate} style={{ 
        marginBottom: '30px', 
        background: '#1a1a1a', 
        padding: '20px', 
        borderRadius: '12px' 
      }}>
        <textarea
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          placeholder="Что у тебя нового?"
          style={{
            width: '100%',
            minHeight: '110px',
            padding: '14px',
            borderRadius: '8px',
            background: '#222',
            color: '#fff',
            border: '1px solid #444',
            fontSize: '16px',
            resize: 'vertical'
          }}
        />
        <button 
          type="submit"
          style={{
            marginTop: '10px',
            padding: '12px 24px',
            background: '#863bff',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          Опубликовать
        </button>
      </form>

      {posts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: '#1a1a1a', borderRadius: '12px' }}>
          <p>Пока нет постов. Будь первым!</p>
        </div>
      ) : (
        posts.map((post) => (
          <div key={post.id} style={{
            background: '#1a1a1a',
            padding: '20px',
            borderRadius: '12px',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <strong style={{ color: '#863bff' }}>@{post.username}</strong>
              
              {user && user.id === post.user_id && (
                <button 
                  onClick={() => deletePost(post.id)}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: '#ff4d4d', 
                    fontSize: '18px',
                    cursor: 'pointer'
                  }}
                >
                  ✕
                </button>
              )}
            </div>

            <p style={{ fontSize: '17px', lineHeight: '1.6', margin: '0 0 12px 0' }}>
              {post.content}
            </p>

            <small style={{ color: '#888' }}>
              {new Date(post.created_at).toLocaleString('ru-RU')}
            </small>
          </div>
        ))
      )}

      {/* Простая пагинация */}
      {pagination.totalPages > 1 && (
        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <button 
            onClick={() => fetchFeed(pagination.currentPage - 1)} 
            disabled={pagination.currentPage === 1}
            style={{ marginRight: '10px', padding: '8px 16px' }}
          >
            ← Назад
          </button>
          <span>Страница {pagination.currentPage} из {pagination.totalPages}</span>
          <button 
            onClick={() => fetchFeed(pagination.currentPage + 1)} 
            disabled={pagination.currentPage === pagination.totalPages}
            style={{ marginLeft: '10px', padding: '8px 16px' }}
          >
            Вперёд →
          </button>
        </div>
      )}
    </div>
  );
};

export default FeedPage;