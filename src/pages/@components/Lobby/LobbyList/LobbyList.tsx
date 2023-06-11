import type { LobbyModel } from '$/commonTypesWithClient/models';
import Link from 'next/link';
import styles from './LobbyList.module.css';

type LobbyProps = {
  lobby: LobbyModel[] | undefined;
  onClick: (lobbyId: LobbyModel['id']) => Promise<void>;
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
          <h3>{lb.title}</h3>
          <h3>{lb.playerNum}/2</h3>
        </Link>
      ))}
    </>
  );
};

export default LobbyList;
