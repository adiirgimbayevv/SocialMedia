import styles from './Modal.module.css';

export default function Modal({ message, onConfirm, onCancel, confirmText = 'Удалить' }) {
  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <p className={styles.message}>{message}</p>
        <div className={styles.buttons}>
          <button onClick={onCancel} className={styles.cancelBtn}>Отмена</button>
          <button onClick={onConfirm} className={styles.confirmBtn}>{confirmText}</button>
        </div>
      </div>
    </div>
  );
}