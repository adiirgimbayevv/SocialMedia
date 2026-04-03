import { useContext } from 'react';
import { PostContext } from '../context/PostContext';
import { AuthContext } from '../context/AuthContext';

const Feed = () => {
  const { posts, loading, deletePost, fetchFeed, pagination } = useContext(PostContext);
  const { user } = useContext(AuthContext);

  if (loading) return <div className="loading">Loading feed...</div>;

  return (
    <div className="feed-container" style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2>Recent Posts</h2>
      
      {posts.length === 0 ? (
        <p>No posts yet. Be the first!</p>
      ) : (
        posts.map((post) => (
          <div key={post.id} className="post-card" style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '15px',
            marginBottom: '15px',
            background: '#fff'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <strong style={{ color: '#007bff' }}>@{post.username}</strong>
              
            
              {user && post.user_id === user.id && (
                <button 
                  onClick={() => deletePost(post.id)}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: '#ff4d4d', 
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Delete
                </button>
              )}
            </div>

            <p style={{ fontSize: '16px', lineHeight: '1.5' }}>{post.content}</p>
            
            <div style={{ fontSize: '12px', color: '#888', marginTop: '10px' }}>
              {new Date(post.created_at).toLocaleString()}
            </div>
          </div>
        ))
      )}

      <div className="pagination" style={{ marginTop: '20px', textAlign: 'center' }}>
        {pagination.currentPage > 1 && (
          <button onClick={() => fetchFeed(pagination.currentPage - 1)}>Previous</button>
        )}
        <span style={{ margin: '0 15px' }}>Page {pagination.currentPage} of {pagination.totalPages}</span>
        {pagination.currentPage < pagination.totalPages && (
          <button onClick={() => fetchFeed(pagination.currentPage + 1)}>Next</button>
        )}
      </div>
    </div>
  );
};

export default Feed;