import type { LobbyModel } from '$/commonTypesWithClient/models';
import Link from 'next/link';
import styles from './LobbyList.module.css';

type LobbyProps = {
  lobby: LobbyModel[] | undefined;
};

export const LobbyList = ({ lobby }: LobbyProps) => {
  return (
    <>
      {lobby?.map((lb) => (
        <Link key={lb.id} className={styles.room} href={'/othello'}>
          <h3>{lb.title}</h3>
          <h3>{lb.playerNum}/2</h3>
        </Link>
      ))}
    </>
  );
};

export default LobbyList;
