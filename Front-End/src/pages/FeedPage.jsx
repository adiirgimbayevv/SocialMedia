import { useState, useEffect } from 'react';
// Импортируем хуки Redux
import { useSelector, useDispatch } from 'react-redux';
// Импортируем экшены из твоего слайса
import { fetchPosts, addPostAsync } from '../store/postSlice'; 
import PostCard from '../components/PostCard';

const Feed = () => {
  const [newContent, setNewContent] = useState('');
  const dispatch = useDispatch();

  const { items: posts, loading } = useSelector((state) => state.posts);

  useEffect(() => {
    dispatch(fetchPosts(1)); 
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    try {

      await dispatch(addPostAsync(newContent)).unwrap(); 
      setNewContent('');
    } catch (err) {
      console.error('Ошибка при создании:', err);
    }
  };

  if (loading && posts.length === 0) {
    return <div style={{ textAlign: 'center', padding: '60px' }}>Загрузка ленты...</div>;
  }

  return (
    <div>
      <form onSubmit={handleSubmit} style={{ marginBottom: '40px', background: '#1a1a1a', padding: '25px', borderRadius: '16px' }}>
        <textarea
          value={newContent}
          onChange={e => setNewContent(e.target.value)}
          placeholder="Что у тебя нового сегодня?"
          style={{ width: '100%', minHeight: '110px', padding: '15px', borderRadius: '12px', background: '#222', color: '#fff', border: 'none', fontSize: '16px', resize: 'none' }}
        />
        <button 
          type="submit" 
          disabled={loading} 
          style={{ marginTop: '12px', padding: '12px 28px', background: '#863bff', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer' }}
        >
          {loading ? 'Публикация...' : 'Опубликовать'}
        </button>
      </form>

      {posts.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#888' }}>Пока нет постов. Будь первым!</p>
      ) : (
        posts.map(post => <PostCard key={post.id} post={post} />)
      )}
    </div>
  );
};

export default Feed;