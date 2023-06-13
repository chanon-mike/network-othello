import Link from 'next/link';
import type { ExtendedBoardModel } from 'src/pages/index.page';
import styles from './LobbyList.module.css';

type LobbyProps = {
  lobby: ExtendedBoardModel[] | undefined;
  onClick: (lobbyId: string) => Promise<void>;
};

export const LobbyList = ({ lobby, onClick }: LobbyProps) => {
  return (
    <>
      {lobby?.map((lb) => (
        <Link
          key={lb.id}
          className={styles.room}
          href={`/othello/${lb.id}`}
          onClick={() => onClick(lb.id)}
        >
          <h3>{lb.lobbyName}</h3>
          <h3>{lb.playerNum}/2</h3>
        </Link>
      ))}
    </>
  );
};

export default LobbyList;
