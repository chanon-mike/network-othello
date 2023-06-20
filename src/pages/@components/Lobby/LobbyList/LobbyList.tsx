import Link from 'next/link';

import type { UserModel } from '$/commonTypesWithClient/models';
import { TrashIcon } from 'src/components/icons/TrashIcon';
import type { ExtendedBoardModel } from 'src/pages/index.page';
import { apiClient } from 'src/utils/apiClient';
import styles from './LobbyList.module.css';

type LobbyProps = {
  lobby: ExtendedBoardModel[] | undefined;
  user: UserModel;
  deleteLobby: (lobbyId: string) => Promise<void>;
};

export const LobbyList = ({ lobby, user, deleteLobby }: LobbyProps) => {
  const joinLobby = async (lobbyId: string) => {
    await apiClient.player._lobbyId(lobbyId).$post();
  };

  return (
    <>
      {lobby?.map((lb) => (
        <div key={lb.id} className={styles.room}>
          <Link
            className={styles.lobbyLinkWrapper}
            href={`/othello/${lb.id}`}
            onClick={() => joinLobby(lb.id)}
          >
            <h3>{lb.lobbyName}</h3>
            <h5>{lb.playerList.length}/2</h5>
          </Link>
          {lb.playerList.some((player) => player.userId === user.id) && (
            <div className={styles.deleteIcon} onClick={async () => deleteLobby(lb.id)}>
              <TrashIcon size={28} fill="#000" />
            </div>
          )}
        </div>
      ))}
    </>
  );
};

export default LobbyList;
