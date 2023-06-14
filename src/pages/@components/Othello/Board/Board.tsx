import type { UserModel } from '$/commonTypesWithClient/models';
import type { BoardArray, Pos } from '$/repository/boardRepository';
import type { PlayerTurn } from '$/repository/playerRepository';
import Disc from '../Disc/Disc';
import styles from './Board.module.css';

type BoardProps = {
  user: UserModel;
  board: BoardArray;
  latestMovePos: Pos | undefined;
  currentTurnPlayerId: PlayerTurn;
  validMoveList: Pos[];
  onClick: (x: number, y: number) => Promise<void>;
};

export const Board = ({
  user,
  board,
  latestMovePos,
  currentTurnPlayerId,
  validMoveList,
  onClick,
}: BoardProps) => {
  return (
    <div className={styles.board}>
      {board.map((row, y) =>
        row.map((color, x) => (
          <div className={styles.cell} key={`${x}-${y}`} onClick={() => onClick(x, y)}>
            {/* Place a disc */}
            {color !== 0 && (
              <Disc x={x} y={y} color={color} showLatestMove={true} latestMovePos={latestMovePos} />
            )}
            {/* Display valid move */}
            {user.id === currentTurnPlayerId &&
              validMoveList.some(({ x: vx, y: vy }) => vx === x && vy === y) && (
                <span className={styles.valid} />
              )}
          </div>
        ))
      )}
    </div>
  );
};

export default Board;
