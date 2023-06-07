import styles from '../Modal.module.css';

export const NoMoveModal = () => {
  return (
    <div className={styles.modal}>
      <p className={styles.modalContent}>NO MORE MOVES</p>
    </div>
  );
};

export default NoMoveModal;
