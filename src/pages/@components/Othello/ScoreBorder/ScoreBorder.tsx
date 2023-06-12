import type { Score } from '$/repository/scoreRepository';
import Disc from '../Disc/Disc';
import styles from './ScoreBorder.module.css';

type ScoreBorderProps = {
  score: Score;
  color: number;
  backgroundColor: string;
};

export const ScoreBorder = ({ score, color, backgroundColor }: ScoreBorderProps) => {
  const discStyle = {
    backgroundColor,
  };

  return (
    <div className={styles.scoreBorder}>
      <Disc showLatestMove={false} style={discStyle} />{' '}
      <span className={styles.score}>x{color === 1 ? score.blackScore : score.whiteScore}</span>
    </div>
  );
};

export default ScoreBorder;
