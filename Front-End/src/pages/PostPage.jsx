import { useParams } from 'react-router-dom';
import { usePost } from '../context/PostContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const PostPage = () => {
  const { id } = useParams();
  const { posts } = usePost();
  const { user } = useAuth();

  const post = posts.find(p => p.id === parseInt(id));

  if (!post) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Пост не найден</div>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <button onClick={() => window.history.back()} style={{ marginBottom: '20px' }}>
        ← Назад
      </button>
      
      <div style={{ background: '#1a1a1a', padding: '25px', borderRadius: '12px' }}>
        <h3>@{post.username}</h3>
        <p style={{ fontSize: '18px', lineHeight: '1.6', margin: '20px 0' }}>{post.content}</p>
        <small style={{ color: '#888' }}>{new Date(post.created_at).toLocaleString('ru-RU')}</small>
      </div>
    </div>
  );
};

export default PostPage;