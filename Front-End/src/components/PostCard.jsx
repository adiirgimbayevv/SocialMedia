// src/components/PostCard.jsx
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { usePost } from '../context/PostContext';

const PostCard = ({ post }) => {
  const { user } = useContext(AuthContext);
  const { deletePost } = usePost();

  const isOwnPost = user && post.user_id === user.id;

  return (
    <div style={{
      background: '#1a1a1a',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '20px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
      border: '1px solid #333'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: '#863bff',
            color: 'white',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '18px'
          }}>
            {post.username ? post.username[0].toUpperCase() : '?'}
          </div>
          <div>
            <strong style={{ color: '#fff', fontSize: '16px' }}>@{post.username}</strong>
            <div style={{ fontSize: '12px', color: '#888' }}>
              {new Date(post.created_at).toLocaleDateString('ru-RU')} • {new Date(post.created_at).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>

        {isOwnPost && (
          <button
            onClick={() => {
              if (window.confirm('Удалить этот пост?')) {
                deletePost(post.id);
              }
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#ff4d4d',
              fontSize: '20px',
              cursor: 'pointer',
              padding: '4px 8px'
            }}
          >
            ✕
          </button>
        )}
      </div>

      <p style={{
        fontSize: '17px',
        lineHeight: '1.6',
        color: '#e0e0e0',
        margin: '15px 0'
      }}>
        {post.content}
      </p>

      <div style={{ fontSize: '13px', color: '#666', marginTop: '10px' }}>
        Echoes • 2026
      </div>
    </div>
  );
};

export default PostCard;