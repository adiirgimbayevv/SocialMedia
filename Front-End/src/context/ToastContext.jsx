import { createContext, useContext, useState } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  // Показать уведомление
  // type: 'success' | 'error' | 'info'
  const showToast = (message, type = 'info') => {
    const id = Date.now(); // уникальный id по времени

    setToasts(prev => [...prev, { id, message, type }]);

    // Автоматически убираем через 3 секунды
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  // Удалить уведомление вручную (по крестику)
  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}