// src/components/Avatar.jsx
const Avatar = ({ username, size = 40 }) => {
  const letter = username ? username[0].toUpperCase() : '?';

  return (
    <div style={{
      width: size,
      height: size,
      background: 'linear-gradient(135deg, #863bff, #aa3bff)',
      color: 'white',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold',
      fontSize: size > 50 ? '24px' : '18px',
      boxShadow: '0 4px 10px rgba(134, 59, 255, 0.3)',
      flexShrink: 0
    }}>
      {letter}
    </div>
  );
};

export default Avatar;