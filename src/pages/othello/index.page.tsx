import type { BoardArray, Pos } from '$/repository/boardRepository';
import type { PlayerTurn } from '$/repository/playerRepository';
import type { Score } from '$/repository/scoreRepository';
import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { userAtom } from 'src/atoms/user';
import { Loading } from 'src/components/Loading/Loading';
import { BasicHeader } from 'src/pages/@components/BasicHeader/BasicHeader';
import { apiClient } from 'src/utils/apiClient';
import { returnNull } from 'src/utils/returnNull';
import styles from './othello.module.css';

const Home = () => {
  // Function to handle disc placement
  const onClick = async (x: number, y: number) => {
    const isValid = validMoveList.some((move) => move.x === x && move.y === y);

    if (isValid) {
      await apiClient.board.$post({ body: { x, y } });
      await fetchBoard();
    }
  };

  const [user] = useAtom(userAtom);
  const [board, setBoard] = useState<BoardArray>();
  const [score, setScore] = useState<Score>({ blackScore: 0, whiteScore: 0 });
  const [latestMove, setLatestMove] = useState<Pos>();
  const [validMoveList, setValidMoveList] = useState<Pos[]>([]);
  const [currentTurnPlayerId, setCurrentTurnPlayerId] = useState<PlayerTurn>();
  const [isGameEnd, setIsGameEnd] = useState<boolean>(false);

  // GET board and GET list of valid move
  const fetchBoard = async () => {
    const response = await apiClient.board.$get().catch(returnNull);

    if (response !== null) {
      setBoard(response.board);
      // Add a list of valid moves
      const validMoveList: Pos[] = await apiClient.board.valid_move.$get();
      setValidMoveList(validMoveList);
    }
  };

  // GET score
  const fetchScore = async () => {
    const response = await apiClient.score.$get().catch(returnNull);
    if (response !== null) setScore(response);
  };

  // GET current player turn id (for displaying valid moves)
  const fetchCurrentTurn = async () => {
    const response = await apiClient.player.$get();
    setCurrentTurnPlayerId(response.currentPlayerId);
  };

  // GET latest move and set it (make both player see the same mark)
  const fetchLatestMove = async () => {
    const response = await apiClient.board.latest_move.$get();
    setLatestMove(response.latestMove);
  };

  // GET is game end or not
  const fetchGameStatus = async () => {
    const response = await apiClient.board.game_end.$get();
    setIsGameEnd(response.isGameEnd);
  };

  // Fetch board every 0.5s to make it look real-time
  useEffect(() => {
    const cancelId = setInterval(() => {
      fetchBoard();
      fetchScore();
      fetchCurrentTurn();
      fetchLatestMove();
      fetchGameStatus();
    }, 500);
    return () => clearInterval(cancelId);
  }, []);

  if (!board || !user) return <Loading visible />;

  return (
    <>
      <BasicHeader user={user} />
      <div className={styles.container}>
        <div className={styles.row}>
          <div className={styles.scoreBorder}>
            <div className={styles.disc} style={{ backgroundColor: '#000' }} />{' '}
            <span className={styles.score}>x{score.blackScore}</span>
          </div>

          <div className={styles.board}>
            {/* Display a board */}
            {board.map((row, y) =>
              row.map((color, x) => (
                <div className={styles.cell} key={`${x}-${y}`} onClick={() => onClick(x, y)}>
                  {/* Place a disc */}
                  {color !== 0 && (
                    <div
                      className={styles.disc}
                      style={{ background: color === 1 ? '#000' : '#fff' }}
                    >
                      {/* Show a mark of latest move in the middle of a disc */}
                      {latestMove?.x === x && latestMove?.y === y && (
                        <div className={styles.current} />
                      )}
                    </div>
                  )}
                  {/* Display valid move */}
                  {user.id === currentTurnPlayerId &&
                    validMoveList.some(({ x: vx, y: vy }) => vx === x && vy === y) && (
                      <span className={`${styles.disc} ${styles.valid}`} />
                    )}
                </div>
              ))
            )}
          </div>

          {/* No moves left for a player */}
          {!validMoveList.length && !isGameEnd && (
            <div className={styles.modal}>
              <p className={styles.modalContent}>NO MORE MOVES</p>
            </div>
          )}
          {/* When all cell are filled, or no more move available for both sides */}
          {isGameEnd && (
            <div className={styles.modal}>
              <div className={styles.row}>
                <div className={styles.disc} style={{ backgroundColor: '#000' }} />{' '}
                <span className={styles.modalContent}>x{score.blackScore}</span>
                <div className={styles.disc} style={{ backgroundColor: '#fff' }} />{' '}
                <span className={styles.modalContent}>x{score.whiteScore}</span>
              </div>
              <p>
                {score.blackScore > score.whiteScore
                  ? 'BLACK WIN'
                  : score.blackScore < score.whiteScore
                  ? 'WHITE WIN'
                  : 'TIE'}
              </p>
              <a
                className={styles.close}
                onClick={async () => await apiClient.board.restart.$put()}
              >
                Restart
              </a>
            </div>
          )}

          <div className={styles.scoreBorder}>
            <div className={styles.disc} style={{ backgroundColor: '#fff' }} />{' '}
            <span className={styles.score}>x{score.whiteScore}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
