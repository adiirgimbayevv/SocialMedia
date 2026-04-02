import { createContext, useState, useContext } from 'react';
import { AuthContext } from './AuthContext';

export const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  
  const [posts, setPosts] = useState([
    { 
      id: 1, 
      username: 'adi20', 
      content: 'Finally launched the feed! 🚀', 
      likes: 5, 
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=adi' 
    },
    { 
      id: 2, 
      username: 'jalgas_dev', 
      content: 'Waiting for the backend to test the API.', 
      likes: 12, 
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jalgas' 
    }
  ]);
  
  const [loading, setLoading] = useState(false);

  const fetchFeed = () => {
    console.log("Feed loaded");
  };

  const toggleLike = (postId) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      )
    );
  };

  const createPost = (content) => {
    if (!user) return;

    const newPost = {
      id: Date.now(),
      username: user.username,
      content: content,
      likes: 0,
      avatar_url: user.avatar_url
    };
    
    setPosts([newPost, ...posts]);
  };

  return (
    <PostContext.Provider value={{ posts, loading, fetchFeed, toggleLike, createPost }}>
      {children}
    </PostContext.Provider>
  );
};

export default PostProvider;