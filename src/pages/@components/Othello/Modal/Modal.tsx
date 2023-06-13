import type { LobbyId } from '$/commonTypesWithClient/branded';
import type { Score } from '$/repository/playerRepository';
import GameEndModal from './GameEndModal/GameEndModal';

type ModalProps = {
  // validMoveList: Pos[];
  isGameEnd: boolean;
  score: Score;
  lobbyId: LobbyId;
};

export const Modal = ({ isGameEnd, score, lobbyId }: ModalProps) => {
  return (
    <>
      {/* No moves left for a player */}
      {/* {!validMoveList.length && !isGameEnd && <NoMoveModal />} */}
      {/* When all cell are filled, or no more move available for both sides */}
      {isGameEnd && <GameEndModal score={score} lobbyId={lobbyId} />}
    </>
  );
};

export default Modal;
