import styles from './Loader.module.scss';

export const Loader = () => (
  <div className={styles.loader}>
    <div className={styles.progressBar}>
      <div className={styles.progress}></div>
    </div>
    <p>Загрузка товаров...</p>
  </div>
);
