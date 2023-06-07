import type { Score } from '$/repository/scoreRepository';
import Disc from '../Disc/Disc';
import styles from './ScoreBorder.module.css';

type ScoreBorderProps = {
  score: Score;
  backgroundColor: string;
};

export const ScoreBorder = ({ score, backgroundColor }: ScoreBorderProps) => {
  const discStyle = {
    backgroundColor,
  };

  return (
    <div className={styles.scoreBorder}>
      <Disc showLatestMove={false} style={discStyle} />{' '}
      <span className={styles.score}>x{score.blackScore}</span>
    </div>
  );
};

export default ScoreBorder;
