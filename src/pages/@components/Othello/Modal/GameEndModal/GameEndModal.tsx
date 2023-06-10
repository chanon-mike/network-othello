import type { Score } from '$/repository/scoreRepository';
import { apiClient } from 'src/utils/apiClient';
import Disc from '../../Disc/Disc';
import styles from '../Modal.module.css';

type GameEndModalProps = {
  score: Score;
};

export const GameEndModal = ({ score }: GameEndModalProps) => {
  const blackDiscStyle = {
    backgroundColor: '#000',
  };

  const whiteDiscStyle = {
    backgroundColor: '#fff',
  };
  return (
    <div className={styles.modal}>
      <div className={styles.wrapper}>
        <Disc showLatestMove={false} style={blackDiscStyle} />{' '}
        <span className={styles.modalContent}>x{score.blackScore}</span>
        <Disc showLatestMove={false} style={whiteDiscStyle} />{' '}
        <span className={styles.modalContent}>x{score.whiteScore}</span>
      </div>
      <p className={styles.modalContent}>
        {score.blackScore > score.whiteScore
          ? 'BLACK WIN'
          : score.blackScore < score.whiteScore
          ? 'WHITE WIN'
          : 'TIE'}
      </p>
      <button className={styles.close} onClick={async () => await apiClient.board.restart.$put()}>
        Restart
      </button>
    </div>
  );
};

export default GameEndModal;