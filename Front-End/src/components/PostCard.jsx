import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { deletePostAsync, toggleLikeAsync, optimisticLike } from '../store/postSlice';
import * as commentApi from '../api/comments';
import * as userApi from '../api/users';
import Avatar from './Avatar';
import Modal from './Modal';
import { Link } from 'react-router-dom';

const PostCard = ({ post }) => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const { showToast } = useToast();

  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // 👇 ИСПРАВЛЕНИЕ: берём начальное значение из поста, не из false
  const [isFollowing, setIsFollowing] = useState(post.is_following || false);

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
      showToast('Комментарий добавлен!', 'success');
    } catch (err) {
      showToast('Не удалось добавить комментарий', 'error');
    }
  };

  const handleFollowToggle = async () => {
    try {
      if (isFollowing) {
        await userApi.unfollowUser(post.user_id);
        setIsFollowing(false);
        showToast(`Вы отписались от @${post.username}`, 'info');
      } else {
        await userApi.followUser(post.user_id);
        setIsFollowing(true);
        showToast(`Вы подписались на @${post.username}`, 'success');
      }
    } catch (err) {
      showToast('Не удалось изменить подписку', 'error');
    }
  };

  const handleLike = () => {
    dispatch(optimisticLike(post.id));
    dispatch(toggleLikeAsync(post.id));
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    setShowDeleteModal(false);
    try {
      await dispatch(deletePostAsync(post.id)).unwrap();
      showToast('Пост удалён', 'success');
    } catch (err) {
      showToast('Не удалось удалить пост', 'error');
    }
  };

  useEffect(() => {
    loadComments();
  }, []);

  return (
    <>
      {showDeleteModal && (
        <Modal
          message="Вы уверены, что хотите удалить этот пост?"
          onConfirm={handleDeleteConfirm}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}

      <div style={{ background: '#1a1a1a', borderRadius: '16px', padding: '22px', marginBottom: '25px', border: '1px solid #333' }}>

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
              style={{ padding: '8px 20px', background: isFollowing ? '#333' : '#863bff', color: 'white', border: 'none', borderRadius: '20px', fontSize: '14px', cursor: 'pointer', minWidth: '110px' }}
            >
              {isFollowing ? 'Отписаться' : 'Подписаться'}
            </button>
          )}

          {isOwnPost && (
            <button onClick={handleDeleteClick} style={{ color: '#ff4d4d', background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer' }}>
              ✕
            </button>
          )}
        </div>

        <Link to={`/post/${post.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <p style={{ margin: '15px 0 20px', fontSize: '17px', lineHeight: '1.65' }}>
            {post.content}
          </p>
        </Link>

        <div style={{ display: 'flex', gap: '25px', paddingTop: '12px', borderTop: '1px solid #333' }}>
          <button
            onClick={handleLike}
            style={{ background: 'none', border: 'none', color: isLiked ? '#ff4d4d' : '#aaa', fontSize: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            ❤️ <span>{likesCount}</span>
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            style={{ background: 'none', border: 'none', color: '#aaa', fontSize: '20px', cursor: 'pointer' }}
          >
            💬 {comments.length}
          </button>
        </div>

        {showComments && (
          <div style={{ marginTop: '20px', background: '#111', padding: '18px', borderRadius: '12px' }}>
            <form onSubmit={handleCommentSubmit} style={{ marginBottom: '15px' }}>
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Напишите комментарий..."
                style={{ width: '100%', padding: '12px', borderRadius: '10px', background: '#222', color: '#fff', border: 'none', fontSize: '15px' }}
              />
            </form>

            {loadingComments ? (
              <p style={{ color: '#666' }}>Загрузка комментариев...</p>
            ) : comments.length === 0 ? (
              <p style={{ color: '#666', fontSize: '14px' }}>Комментариев пока нет. Будьте первым!</p>
            ) : (
              comments.map((c) => (
                <div key={c.id} style={{ marginBottom: '12px', padding: '10px', background: '#1a1a1a', borderRadius: '8px', fontSize: '15px' }}>
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
    </>
  );
};

export default PostCard;