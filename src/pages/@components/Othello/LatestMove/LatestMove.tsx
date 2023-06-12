import type { Pos } from '$/repository/board/boardRepository';
import styles from './LatestMove.module.css';

type LatestMoveProps = {
  x: number | undefined;
  y: number | undefined;
  latestMove: Pos | undefined;
};

export const LatestMove = ({ x, y, latestMove }: LatestMoveProps) => {
  return (
    <>
      {/* Show a mark of latest move in the middle of a disc */}
      {latestMove?.x === x && latestMove?.y === y && <div className={styles.current} />}
    </>
  );
};

export default LatestMove;
