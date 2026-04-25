import { useToast } from '../context/ToastContext';
import styles from './Toast.module.css';

export default function Toast() {
  const { toasts, removeToast } = useToast();

  // Если нет уведомлений — ничего не рендерим
  if (toasts.length === 0) return null;

  return (
    <div className={styles.container}>
      {toasts.map(toast => (
        <div key={toast.id} className={`${styles.toast} ${styles[toast.type]}`}>
          <span>{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className={styles.closeBtn}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}