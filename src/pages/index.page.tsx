import type { BoardModel } from '$/commonTypesWithClient/models';
import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import type { ChangeEvent, FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { Loading } from 'src/components/Loading/Loading';
import { apiClient } from 'src/utils/apiClient';
import { userAtom } from '../atoms/user';
import { BasicHeader } from './@components/BasicHeader/BasicHeader';
import CreateLobby from './@components/Lobby/CreateLobby/CreateLobby';
import { LobbyList } from './@components/Lobby/LobbyList/LobbyList';
import styles from './index.module.css';

export type ExtendedBoardModel = BoardModel & { playerNum: number };

const Home = () => {
  const [user] = useAtom(userAtom);
  const [lobby, setLobby] = useState<ExtendedBoardModel[] | undefined>(undefined);
  const [lobbyName, setLobbyName] = useState<string>('');
  const router = useRouter();
  // Handle on change of lobby name
  const inputLobbyName = (e: ChangeEvent<HTMLInputElement>) => {
    setLobbyName(e.target.value);
  };

  const fetchLobby = async () => {
    // Fetch all lobby and find player in each lobby, then calculate current playerNum in each lobby
    const lobbyResponse = await apiClient.board.$get();

    if (lobbyResponse !== null && Array.isArray(lobbyResponse)) {
      // Use Promise.all to resolve when all promises in array have resolved
      const lobbyPromises = lobbyResponse.map(async (lb) => {
        const playerResponse = await apiClient.player._lobbyId(lb.id).$get();
        return { ...lb, playerNum: playerResponse.player.length };
      });
      const allLobbies = await Promise.all(lobbyPromises);
      setLobby(allLobbies);
    }
  };

  const createLobby = async (e: FormEvent) => {
    // Create a new lobby, create a new player from current user and add to new lobby
    e.preventDefault();
    if (!lobbyName) return;

    const boardResponse = await apiClient.board.$post({ body: { lobbyName } });
    const playerResponse = await apiClient.player._lobbyId(boardResponse.id).$post();
    const fetchLobbyPromise = fetchLobby();

    await Promise.allSettled([boardResponse, playerResponse, fetchLobbyPromise]);
    setLobbyName('');
    router.push(`othello/${boardResponse.id}`);
  };

  const joinLobby = async (lobbyId: string) => {
    await apiClient.player._lobbyId(lobbyId).$post();
  };

  useEffect(() => {
    fetchLobby();
  }, []);

  useEffect(() => {
    // Fetch lobby when route change
    router.events.on('routeChangeComplete', fetchLobby);
    return () => router.events.off('routeChangeComplete', fetchLobby);
  }, [router]);

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
        <div className={styles.title}>Welcome {user.displayName} to Online Othello</div>
        <LobbyList lobby={lobby} onClick={joinLobby} />
      </div>
    </>
  );
};

export default Home;
