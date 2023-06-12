import type { Pos } from '$/repository/board/boardRepository';
import type { Score } from '$/repository/scoreRepository';
import GameEndModal from './GameEndModal/GameEndModal';
import NoMoveModal from './NoMoveModal/NoMoveModal';

type ModalProps = {
  validMoveList: Pos[];
  isGameEnd: boolean;
  score: Score;
  lobbyId: number;
};

export const Modal = ({ validMoveList, isGameEnd, score, lobbyId }: ModalProps) => {
  return (
    <>
      {/* No moves left for a player */}
      {!validMoveList.length && !isGameEnd && <NoMoveModal />}
      {/* When all cell are filled, or no more move available for both sides */}
      {isGameEnd && <GameEndModal score={score} lobbyId={lobbyId} />}
    </>
  );
};

export default Modal;
