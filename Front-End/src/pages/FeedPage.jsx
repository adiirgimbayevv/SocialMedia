import { useContext, useState } from 'react';
import { usePost } from '../context/PostContext';
import PostCard from '../components/PostCard';

const Feed = () => {
  const { posts, loading, createPost } = usePost();
  const [newContent, setNewContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newContent.trim()) return;
    await createPost(newContent);
    setNewContent('');
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '60px' }}>Загрузка ленты...</div>;

  return (
    <div>
      {/* Форма создания поста */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '40px', background: '#1a1a1a', padding: '25px', borderRadius: '16px' }}>
        <textarea
          value={newContent}
          onChange={e => setNewContent(e.target.value)}
          placeholder="Что у тебя нового сегодня?"
          style={{ width: '100%', minHeight: '110px', padding: '15px', borderRadius: '12px', background: '#222', color: '#fff', border: 'none', fontSize: '16px' }}
        />
        <button type="submit" style={{ marginTop: '12px', padding: '12px 28px', background: '#863bff', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '600' }}>
          Опубликовать
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