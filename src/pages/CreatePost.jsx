import { useState, useContext } from 'react';
import { PostContext } from '../context/PostContext';

const CreatePost = () => {
  const [content, setContent] = useState('');
  const { createPost } = useContext(PostContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    createPost(content);
    setContent('');
    alert('Post created (check console)!');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Create New Post</h2>
      <form onSubmit={handleSubmit}>
        <textarea 
          value={content} 
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          style={{ width: '100%', minHeight: '100px', marginBottom: '10px' }}
        />
        <br />
        <button type="submit">Post</button>
      </form>
    </div>
  );
};

export default CreatePost; // <--- ВОТ ЭТО ОН ТРЕБОВАЛ В КОНСОЛИ