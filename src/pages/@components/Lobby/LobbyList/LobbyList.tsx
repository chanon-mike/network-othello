import Link from 'next/link';

import type { ExtendedBoardModel } from 'src/pages/index.page';
import { apiClient } from 'src/utils/apiClient';
import styles from './LobbyList.module.css';

type LobbyProps = {
  lobby: ExtendedBoardModel[] | undefined;
};

export const LobbyList = ({ lobby }: LobbyProps) => {
  const joinLobby = async (lobbyId: string) => {
    await apiClient.player._lobbyId(lobbyId).$post();
  };

  return (
    <>
      {lobby?.map((lb) => (
        <Link
          key={lb.id}
          className={styles.room}
          href={`/othello/${lb.id}`}
          onClick={() => joinLobby(lb.id)}
        >
          <h3 className={styles.lobbyName}>{lb.lobbyName}</h3>
          <h3>{lb.playerNum}/2</h3>
        </Link>
      ))}
    </>
  );
};

export default LobbyList;
