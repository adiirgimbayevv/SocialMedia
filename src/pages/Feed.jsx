import { useContext, useEffect } from 'react';
import { PostContext } from '../context/PostContext';
import { AuthContext } from '../context/AuthContext';

const Feed = () => {
  const { posts, loading, deletePost, fetchFeed, pagination } = useContext(PostContext);
  const { user } = useContext(AuthContext);

  // Добавим этот эффект, чтобы при заходе на страницу лента всегда обновлялась
  useEffect(() => {
    fetchFeed();
  }, []);

  // Выводим посты в консоль для отладки (поможет твоему другу)
  console.log("Текущие посты в компоненте Feed:", posts);

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <div className="loader">Загрузка ленты...</div>
    </div>
  );

  return (
    <div className="feed-container" style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Recent Posts</h2>
        <button onClick={() => fetchFeed()} style={{ padding: '5px 10px', fontSize: '12px', cursor: 'pointer' }}>
          Обновить
        </button>
      </div>
      
      {posts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', background: '#f9f9f9', borderRadius: '8px' }}>
          <p>Постов пока нет. Будь первым!</p>
          <p style={{ fontSize: '12px', color: '#888' }}>(Проверь подключение к БД, если посты должны быть)</p>
        </div>
      ) : (
        posts.map((post) => (
          <div key={post.id} className="post-card" style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '15px',
            marginBottom: '15px',
            background: '#fff',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <strong style={{ color: '#007bff' }}>@{post.username || 'Anonymous'}</strong>
              
              {/* Проверка: кнопка удаления только для автора */}
              {user && post.user_id === user.id && (
                <button 
                  onClick={() => {
                    if(window.confirm('Удалить этот пост?')) deletePost(post.id);
                  }}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: '#ff4d4d', 
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}
                >
                  ✕
                </button>
              )}
            </div>

            <p style={{ fontSize: '16px', lineHeight: '1.5', color: '#333' }}>{post.content}</p>
            
            <div style={{ fontSize: '12px', color: '#888', marginTop: '10px', borderTop: '1px solid #eee', paddingTop: '5px' }}>
              {post.created_at ? new Date(post.created_at).toLocaleString() : 'Дата неизвестна'}
            </div>
          </div>
        ))
      )}

      {/* Пагинация */}
      {pagination.totalPages > 1 && (
        <div className="pagination" style={{ marginTop: '20px', textAlign: 'center' }}>
          {pagination.currentPage > 1 && (
            <button onClick={() => fetchFeed(pagination.currentPage - 1)}>Назад</button>
          )}
          <span style={{ margin: '0 15px' }}>Страница {pagination.currentPage} из {pagination.totalPages}</span>
          {pagination.currentPage < pagination.totalPages && (
            <button onClick={() => fetchFeed(pagination.currentPage + 1)}>Вперед</button>
          )}
        </div>
      )}
    </div>
  );
};

export default Feed;