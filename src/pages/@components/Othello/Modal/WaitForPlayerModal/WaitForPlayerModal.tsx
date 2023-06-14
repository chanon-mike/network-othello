import styles from '../Modal.module.css';

export const WaitForPlayerModal = () => {
  return (
    <div className={styles.modal}>
      <p className={styles.modalContent}>Wait for another player</p>
    </div>
  );
};

export default WaitForPlayerModal;
