// frontend/src/components/PostCard.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { usePost } from '../context/PostContext';
import * as commentApi from '../api/comments';
import * as userApi from '../api/users';
import Avatar from './Avatar';
import { Link } from 'react-router-dom';

const PostCard = ({ post }) => {
  const { user } = useAuth();                   
  const { handleLike, deletePost } = usePost();

  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  const isOwnPost = user && post.user_id === user.id;
  const likesCount = post.likes_count || 0;
  const isLiked = post.liked_by_user || false;

  const loadComments = async () => {
    setLoadingComments(true);
    try {
      const res = await commentApi.fetchComments(post.id);
      setComments(res.data.data || []);
    } catch (err) {
      console.error('Ошибка загрузки комментариев:', err);
    } finally {
      setLoadingComments(false);
    }
  };

  
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await commentApi.createComment(post.id, newComment);
      setNewComment('');
      loadComments();           
    } catch (err) {
      alert('Не удалось добавить комментарий');
    }
  };


const handleFollowToggle = async () => {
  try {
    if (isFollowing) {
      await userApi.unfollowUser(post.user_id);
      setIsFollowing(false);
    } else {
      await userApi.followUser(post.user_id);
      setIsFollowing(true);
    }
  } catch (err) {
    console.error(err);
    alert('Не удалось изменить подписку. Попробуйте ещё раз.');
  }
};


  useEffect(() => {
  
  loadComments(); 
}, []);

  return (
    <div style={{
      background: '#1a1a1a',
      borderRadius: '16px',
      padding: '22px',
      marginBottom: '25px',
      border: '1px solid #333'
    }}>

<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
    <Avatar username={post.username} size={50} />
    <div>
      <strong>@{post.username}</strong>
      <div style={{ fontSize: '13px', color: '#888' }}>
        {new Date(post.created_at).toLocaleString('ru-RU')}
      </div>
    </div>
  </div>

  {!isOwnPost && (
    <button
      onClick={handleFollowToggle}
      style={{
        padding: '8px 20px',
        background: isFollowing ? '#333' : '#863bff',
        color: 'white',
        border: 'none',
        borderRadius: '20px',
        fontSize: '14px',
        cursor: 'pointer',
        minWidth: '110px'
      }}
    >
      {isFollowing ? 'Отписаться' : 'Подписаться'}
    </button>
  )}

  {isOwnPost && (
    <button onClick={() => deletePost(post.id)} style={{ color: '#ff4d4d', background: 'none', border: 'none', fontSize: '22px' }}>
      ✕
    </button>
  )}
</div>
<Link to={`/post/${post.id}`} style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}>
  <p style={{ margin: '15px 0 20px', fontSize: '17px', lineHeight: '1.65' }}>
    {post.content}
  </p>
</Link>

      <div style={{ 
        display: 'flex', 
        gap: '25px', 
        paddingTop: '12px', 
        borderTop: '1px solid #333' 
      }}>
        <button
          onClick={() => handleLike(post.id)}
          style={{ 
            background: 'none', 
            border: 'none', 
            color: isLiked ? '#ff4d4d' : '#aaa', 
            fontSize: '20px', 
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          ❤️ <span>{likesCount}</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          style={{ 
            background: 'none', 
            border: 'none', 
            color: '#aaa', 
            fontSize: '20px', 
            cursor: 'pointer' 
          }}
        >
          💬 {comments.length}
        </button>
      </div>

      {/* Блок комментариев */}
      {showComments && (
        <div style={{ marginTop: '20px', background: '#111', padding: '18px', borderRadius: '12px' }}>
          <form onSubmit={handleCommentSubmit} style={{ marginBottom: '15px' }}>
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Напишите комментарий..."
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                background: '#222',
                color: '#fff',
                border: 'none',
                fontSize: '15px'
              }}
            />
          </form>

          {loadingComments ? (
            <p style={{ color: '#666' }}>Загрузка комментариев...</p>
          ) : comments.length === 0 ? (
            <p style={{ color: '#666', fontSize: '14px' }}>Комментариев пока нет. Будьте первым!</p>
          ) : (
            comments.map((c) => (
              <div key={c.id} style={{ 
                marginBottom: '12px', 
                padding: '10px', 
                background: '#1a1a1a', 
                borderRadius: '8px',
                fontSize: '15px'
              }}>
                <strong>@{c.username}</strong>: {c.content}
                <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                  {new Date(c.created_at).toLocaleString('ru-RU')}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default PostCard;