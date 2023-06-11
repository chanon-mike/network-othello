import type { BoardArray, Pos } from '$/repository/boardRepository';
import type { PlayerTurn } from '$/repository/playerRepository';
import type { Score } from '$/repository/scoreRepository';
import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { userAtom } from 'src/atoms/user';
import { Loading } from 'src/components/Loading/Loading';
import { BasicHeader } from 'src/pages/@components/BasicHeader/BasicHeader';
import { apiClient } from 'src/utils/apiClient';
import { returnNull } from 'src/utils/returnNull';
import Board from '../@components/Othello/Board/Board';
import Modal from '../@components/Othello/Modal/Modal';
import ScoreBorder from '../@components/Othello/ScoreBorder/ScoreBorder';
import styles from './index.module.css';

const Home = () => {
  // Function to handle disc placement
  const onClick = async (x: number, y: number) => {
    const isValid = validMoveList.some((move) => move.x === x && move.y === y);

    if (isValid) {
      // await apiClient.board.$post({ body: { x, y } });
      await apiClient.board._lobbyId(lobbyIdRef.current).$put({ body: { x, y } });
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

  // Route handler data
  const router = useRouter();
  const { lobbyId } = router.query;
  const lobbyIdRef = useRef<number>(parseInt(lobbyId as string, 10));

  // Update lobbyIdRef whenever lobbyId change
  useEffect(() => {
    lobbyIdRef.current = parseInt(lobbyId as string, 10);
  }, [lobbyId]);

  // GET board and GET list of valid move
  const fetchBoard = async () => {
    const response = await apiClient.board._lobbyId(lobbyIdRef.current).$get().catch(returnNull);

    if (response !== null) {
      setBoard(response.board.boardData);
      // Add a list of valid moves
      const validMoveList: Pos[] = await apiClient.board
        ._lobbyId(lobbyIdRef.current)
        .valid_move.$get();
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
    const response = await apiClient.player._lobbyId(lobbyIdRef.current).turn.$get();
    setCurrentTurnPlayerId(response.currentTurnUserId);
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
          <ScoreBorder score={score} backgroundColor={'#000'} />

          <Board
            user={user}
            board={board}
            latestMovePos={latestMove}
            currentTurnPlayerId={currentTurnPlayerId}
            validMoveList={validMoveList}
            onClick={onClick}
          />
          <Modal validMoveList={validMoveList} isGameEnd={isGameEnd} score={score} />

          <ScoreBorder score={score} backgroundColor={'#fff'} />
        </div>
      </div>
    </>
  );
};

export default Home;
