import type { LobbyId } from '$/commonTypesWithClient/branded';
import type { GameStatus } from '$/repository/boardRepository';
import type { Score } from '$/repository/playerRepository';
import GameEndModal from './GameEndModal/GameEndModal';
import WaitForPlayerModal from './WaitForPlayerModal/WaitForPlayerModal';

type ModalProps = {
  // validMoveList: Pos[];
  gameStatus: GameStatus;
  score: Score;
  lobbyId: LobbyId;
};

export const Modal = ({ gameStatus, score, lobbyId }: ModalProps) => {
  return (
    <>
      {/* No moves left for a player */}
      {/* {!validMoveList.length && !isGameEnd && <NoMoveModal />} */}
      {/* When all cell are filled, or no more move available for both sides */}
      {gameStatus === 'ended' && <GameEndModal score={score} lobbyId={lobbyId} />}
      {gameStatus === 'waiting' && <WaitForPlayerModal />}
    </>
  );
};

export default Modal;
