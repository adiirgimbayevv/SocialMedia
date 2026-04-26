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
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState('');


  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null); 

  const [isFollowing, setIsFollowing] = useState(post.is_following || false);

  const isOwnPost = user && post.user_id === user.id;
  const likesCount = post.likes_count || 0;
  const isLiked = post.liked_by_user || false;

  useEffect(() => {
    setIsFollowing(post.is_following);
  }, [post.is_following]);

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

  // --- Логика редактирования комментария ---
  const startEditing = (comment) => {
    setEditingCommentId(comment.id);
    setEditCommentText(comment.content);
  };

  const handleUpdateComment = async (commentId) => {
    try {
      // Предполагаем, что в commentApi есть метод updateComment(id, data)
      await commentApi.updateComment(commentId, { content: editCommentText });
      setComments(prev => prev.map(c => c.id === commentId ? { ...c, content: editCommentText } : c));
      setEditingCommentId(null);
      showToast('Комментарий обновлен', 'success');
    } catch (err) {
      showToast('Ошибка при обновлении', 'error');
    }
  };

  // --- Логика удаления комментария ---
  const confirmDeleteComment = (commentId) => {
    setCommentToDelete(commentId);
  };

  const handleCommentDeleteConfirm = async () => {
    if (!commentToDelete) return;
    try {
      await commentApi.deleteComment(commentToDelete);
      setComments(prev => prev.filter(c => c.id !== commentToDelete));
      showToast('Комментарий удалён', 'success');
    } catch (err) {
      showToast('Не удалось удалить комментарий', 'error');
    } finally {
      setCommentToDelete(null);
    }
  };

  const handleFollowToggle = async () => {
    const newStatus = !isFollowing;
    try {
      if (isFollowing) {
        await userApi.unfollowUser(post.user_id);
        showToast(`Вы отписались от @${post.username}`, 'info');
      } else {
        await userApi.followUser(post.user_id);
        showToast(`Вы подписались на @${post.username}`, 'success');
      }
      const event = new CustomEvent('userFollowChanged', { 
        detail: { userId: post.user_id, isFollowing: newStatus } 
      });
      window.dispatchEvent(event);
    } catch (err) {
      showToast('Не удалось изменить подписку', 'error');
    }
  };

  const handleLike = () => {
    dispatch(optimisticLike(post.id));
    dispatch(toggleLikeAsync(post.id));
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

  useEffect(() => {
    const handleGlobalFollowChange = (event) => {
      if (event.detail.userId === post.user_id) {
        setIsFollowing(event.detail.isFollowing);
      }
    };
    window.addEventListener('userFollowChanged', handleGlobalFollowChange);
    return () => window.removeEventListener('userFollowChanged', handleGlobalFollowChange);
  }, [post.user_id]);

  return (
    <>
      {showDeleteModal && (
        <Modal
          message="Вы уверены, что хотите удалить этот пост?"
          onConfirm={handleDeleteConfirm}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}

      {commentToDelete && (
        <Modal
          message="Удалить этот комментарий?"
          onConfirm={handleCommentDeleteConfirm}
          onCancel={() => setCommentToDelete(null)}
        />
      )}

      <div style={{ background: '#1a1a1a', borderRadius: '16px', padding: '22px', marginBottom: '25px', border: '1px solid #333' }}>
        
        {/* Хедер поста */}
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
            <button onClick={() => setShowDeleteModal(true)} style={{ color: '#ff4d4d', background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer' }}>
              ✕
            </button>
          )}
        </div>

        <Link to={`/post/${post.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <p style={{ margin: '15px 0 20px', fontSize: '17px', lineHeight: '1.65' }}>
            {post.content}
          </p>
        </Link>

        {/* Лайки и кнопка комментов */}
        <div style={{ display: 'flex', gap: '25px', paddingTop: '12px', borderTop: '1px solid #333' }}>
          <button onClick={handleLike} style={{ background: 'none', border: 'none', color: isLiked ? '#ff4d4d' : '#aaa', fontSize: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
            ❤️ <span>{likesCount}</span>
          </button>
          <button onClick={() => setShowComments(!showComments)} style={{ background: 'none', border: 'none', color: '#aaa', fontSize: '20px', cursor: 'pointer' }}>
            💬 {comments.length}
          </button>
        </div>

        {/* Секция комментариев */}
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
              <p style={{ color: '#666' }}>Загрузка...</p>
            ) : (
              comments.map((c) => (
                <div key={c.id} style={{ marginBottom: '12px', padding: '10px', background: '#1a1a1a', borderRadius: '8px', fontSize: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <strong>@{c.username}</strong>
                    
                    {/* Кнопки действий для коммента */}
                    {user && user.id === c.user_id && (
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={() => startEditing(c)} style={{ background: 'none', border: 'none', color: '#863bff', cursor: 'pointer', fontSize: '12px' }}>ред.</button>
                        <button onClick={() => confirmDeleteComment(c.id)} style={{ background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer' }}>✕</button>
                      </div>
                    )}
                  </div>

                  {editingCommentId === c.id ? (
                    <div style={{ marginTop: '5px' }}>
                      <input 
                        value={editCommentText} 
                        onChange={(e) => setEditCommentText(e.target.value)}
                        style={{ width: '100%', background: '#333', color: '#fff', border: '1px solid #863bff', padding: '5px', borderRadius: '4px' }}
                      />
                      <div style={{ marginTop: '5px', display: 'flex', gap: '10px' }}>
                        <button onClick={() => handleUpdateComment(c.id)} style={{ fontSize: '12px', background: '#863bff', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px' }}>Сохранить</button>
                        <button onClick={() => setEditingCommentId(null)} style={{ fontSize: '12px', color: '#aaa', background: 'none', border: 'none' }}>Отмена</button>
                      </div>
                    </div>
                  ) : (
                    <p style={{ margin: '5px 0' }}>{c.content}</p>
                  )}
                  
                  <div style={{ fontSize: '12px', color: '#666' }}>{new Date(c.created_at).toLocaleString('ru-RU')}</div>
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