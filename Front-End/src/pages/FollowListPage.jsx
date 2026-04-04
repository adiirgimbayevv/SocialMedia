// frontend/src/pages/FollowListPage.jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import * as followApi from '../api/follow';
import Avatar from '../components/Avatar';

const FollowListPage = () => {
  const { type } = useParams(); // "following" или "followers"
  
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isFollowingPage = type === 'following';
  const title = isFollowingPage ? 'Мои подписки' : 'Мои подписчики';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = isFollowingPage 
          ? await followApi.getMyFollowing() 
          : await followApi.getMyFollowers();
        
        setList(res.data || []);
      } catch (err) {
        console.error(err);
        setError('Ошибка при загрузке списка');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [type]); // перезагружаем при смене типа

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Загрузка...</div>;
  if (error) return <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>;

  return (
    <div style={{ maxWidth: '650px', margin: '30px auto', padding: '0 20px' }}>
      <h2>{title}</h2>
      
      {list.length === 0 ? (
        <p style={{ color: '#888', marginTop: '30px', fontSize: '17px' }}>
          {isFollowingPage 
            ? 'Вы ещё ни на кого не подписаны' 
            : 'У вас пока нет подписчиков'}
        </p>
      ) : (
        list.map((u) => (
          <div key={u.id} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            background: '#1a1a1a',
            padding: '16px',
            borderRadius: '12px',
            marginBottom: '12px'
          }}>
            <Avatar username={u.username} size={52} />
            <div style={{ flex: 1 }}>
              <strong>@{u.username}</strong>
              <div style={{ color: '#aaa', fontSize: '14px' }}>{u.email}</div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default FollowListPage;