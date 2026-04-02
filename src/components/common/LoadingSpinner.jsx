const LoadingSpinner = () => (
  <div style={{ textAlign: 'center', padding: '40px' }}>
    <div style={{ 
      width: '40px', 
      height: '40px', 
      border: '5px solid #f3f3f3', 
      borderTop: '5px solid #863bff', 
      borderRadius: '50%', 
      animation: 'spin 1s linear infinite',
      margin: '0 auto'
    }}></div>
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    <p style={{ marginTop: '15px' }}>Загрузка...</p>
  </div>
);

export default LoadingSpinner;