import { useParams } from 'react-router-dom';
import { useContext } from 'react';
import { PostContext } from '../context/PostContext';

const PostDetail = () => {
  const { id } = useParams(); // Достаем ID из ссылки /post/1
  const { posts } = useContext(PostContext);

  // Ищем конкретный пост в нашем массиве по ID
  const post = posts.find(p => p.id === parseInt(id));

  if (!post) {
    return <div style={{ padding: '20px' }}>Post not found!</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <button onClick={() => window.history.back()}>← Back</button>
      <div style={{ border: '1px solid #ddd', marginTop: '20px', padding: '20px', borderRadius: '8px' }}>
        <h3>@{post.username}</h3>
        <p style={{ fontSize: '1.2rem' }}>{post.content}</p>
        <hr />
        <p>Likes: {post.likes}</p>
        {/* Здесь в будущем будут комментарии */}
      </div>
    </div>
  );
};

export default PostDetail;