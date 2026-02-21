import { useEffect } from 'react';
import styles from './Toast.module.scss';

interface Props {
  message: string;
  onClose: () => void;
}

export const Toast = ({ message, onClose }: Props) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={styles.toast}>
      <span>{message}</span>
      <button onClick={onClose} className={styles.closeBtn}>×</button>
    </div>
  );
};
