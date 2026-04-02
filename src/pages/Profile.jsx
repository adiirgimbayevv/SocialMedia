import { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { UserContext } from '../context/UserContext';

const Profile = () => {
  const { id } = useParams();
  const { user: currentUser } = useContext(AuthContext);
  const { toggleFollow, isFollowing } = useContext(UserContext);

  const userId = parseInt(id);
  const isMyProfile = currentUser?.id === userId;
  const followingThisUser = isFollowing(userId);

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>User Profile {id}</h1>
      
      {!isMyProfile && (
        <button 
          onClick={() => toggleFollow(userId)}
          style={{
            background: followingThisUser ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          {followingThisUser ? 'Unfollow' : 'Follow'}
        </button>
      )}
      
      {/* Остальной код профиля с постами */}
    </div>
  );
};

export default Profile;