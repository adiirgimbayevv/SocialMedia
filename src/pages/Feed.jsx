import { useContext, useEffect } from 'react';
import { PostContext } from '../context/PostContext';

const Feed = () => {
  const { posts, fetchFeed, loading, toggleLike } = useContext(PostContext);

  useEffect(() => {
    fetchFeed();
  }, []);

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>News Feed</h1>
      {loading ? <p>Loading...</p> : posts.map(post => (
        <div key={post.id} style={{ 
          border: '1px solid #ddd', 
          margin: '15px 0', 
          padding: '15px', 
          borderRadius: '10px',
          display: 'flex',
          gap: '15px'
        }}>
          <img src={post.avatar_url} alt="avatar" style={{ width: '50px', borderRadius: '50%' }} />
          <div>
            <p><strong>@{post.username}</strong></p>
            <p>{post.content}</p>
            <button 
              onClick={() => toggleLike(post.id)} 
              style={{ cursor: 'pointer', background: '#e1f5fe', border: 'none', padding: '5px 10px', borderRadius: '5px' }}
            >
              ❤️ {post.likes}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Feed;