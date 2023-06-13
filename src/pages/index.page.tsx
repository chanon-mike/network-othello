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
    // Fetch all lobby and find player in each lobby, then calculate current playerNum in each lobby
    const lobbyResponse = await apiClient.board.$get().catch(returnNull);

    if (lobbyResponse !== null) {
      // Use Promise.all to resolve when all promises in array have resolved
      const lobbyPromises = lobbyResponse.lobby.map(async (lb) => {
        const playerResponse = await apiClient.player._lobbyId(lb.id).$get();
        lb.playerNum = playerResponse.player.length;
        return lb;
      });
      setLobby(await Promise.all(lobbyPromises));
    }
  };

  const createLobby = async (e: FormEvent) => {
    // Create a new lobby, create a new player from current user and add to new lobby
    e.preventDefault();
    if (!lobbyName) return;

    const lobbyResponse = await apiClient.lobby.$post({ body: { title: lobbyName } });
    const boardResponse = await apiClient.board._lobbyId(lobbyResponse.lobby.id).$post();
    const playerResponse = await apiClient.player._lobbyId(lobbyResponse.lobby.id).$post();
    const fetchLobbyPromise = fetchLobby();

    await Promise.allSettled([lobbyResponse, playerResponse, boardResponse, fetchLobbyPromise]);
    setLobbyName('');
  };

  const joinLobby = async (lobbyId: LobbyModel['id']) => {
    const playerResponse = await apiClient.player._lobbyId(lobbyId).$post();
    console.log(playerResponse);
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
        <LobbyList lobby={lobby} onClick={joinLobby} />
      </div>
    </>
  );
};

export default Home;
