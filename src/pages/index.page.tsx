import type { LobbyModel } from '$/commonTypesWithClient/models';
import { useAtom } from 'jotai';
import type { ChangeEvent, FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { Loading } from 'src/components/Loading/Loading';
import { apiClient } from 'src/utils/apiClient';
import { returnNull } from 'src/utils/returnNull';
import { userAtom } from '../atoms/user';
import { BasicHeader } from './@components/BasicHeader/BasicHeader';
import CreateLobby from './@components/Lobby/CreateLobby/CreateLobby';
import { LobbyList } from './@components/Lobby/LobbyList/LobbyList';
import styles from './index.module.css';

const Home = () => {
  const [user] = useAtom(userAtom);
  const [lobby, setLobby] = useState<LobbyModel[] | undefined>(undefined);
  const [lobbyName, setLobbyName] = useState<string>('');
  // Handle on change of lobby name
  const inputLobbyName = (e: ChangeEvent<HTMLInputElement>) => {
    setLobbyName(e.target.value);
  };

  const fetchLobby = async () => {
    const response = await apiClient.lobby.$get().catch(returnNull);

    if (response !== null) {
      setLobby(response.lobby);
    }
  };

  const createLobby = async (e: FormEvent) => {
    e.preventDefault();
    if (!lobbyName) return;

    await apiClient.lobby.$post({ body: { title: lobbyName } });
    setLobbyName('');
    await fetchLobby();
  };

  useEffect(() => {
    fetchLobby();
  }, []);

  if (!user) return <Loading visible />;

  return (
    <>
      <BasicHeader user={user} />
      <div className={styles.container}>
        <CreateLobby
          lobbyName={lobbyName}
          inputLobbyName={inputLobbyName}
          createLobby={createLobby}
        />
        <div className={styles.title}>Go to othello game</div>
        <LobbyList lobby={lobby} />
      </div>
    </>
  );
};

export default Home;
