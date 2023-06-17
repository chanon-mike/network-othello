import type { UserModel } from '$/commonTypesWithClient/models';
import type { PlayerTurn, Score } from '$/repository/playerRepository';
import Disc from '../Disc/Disc';
import styles from './ScoreBorder.module.css';

type ScoreBorderProps = {
  score: Score;
  currentTurnPlayerId: PlayerTurn;
  user: UserModel;
};

export const ScoreBorder = ({ score, currentTurnPlayerId, user }: ScoreBorderProps) => {
  return (
    <div className={styles.scoreBorder}>
      <Disc showLatestMove={false} style={{ backgroundColor: '#000' }} />
      <span className={styles.score}>x{score.blackScore}</span>
      <div className={styles.turnOrder}>
        {user.id === currentTurnPlayerId ? 'Your turn' : 'Opponent turn'}
      </div>
      <Disc showLatestMove={false} style={{ backgroundColor: '#fff' }} />
      <span className={styles.score}>x{score.whiteScore}</span>
    </div>
  );
};

export default ScoreBorder;
