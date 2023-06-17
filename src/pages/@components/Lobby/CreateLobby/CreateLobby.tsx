import type { NextRouter } from 'next/router';
import { useState, type ChangeEvent, type FormEvent } from 'react';
import { apiClient } from 'src/utils/apiClient';
import styles from './CreateLobby.module.css';

type CreateLobbyProps = {
  router: NextRouter;
};

export const CreateLobby = ({ router }: CreateLobbyProps) => {
  const [lobbyName, setLobbyName] = useState<string>('');

  // Handle on change of lobby name
  const inputLobbyName = (e: ChangeEvent<HTMLInputElement>) => {
    setLobbyName(e.target.value);
  };

  // Create a new lobby, create a new player from current user and add to new lobby
  const createLobby = async (e: FormEvent) => {
    e.preventDefault();
    if (!lobbyName) return;

    const boardResponse = await apiClient.board.$post({ body: { lobbyName } });
    const playerResponse = await apiClient.player._lobbyId(boardResponse.id).$post();

    await Promise.allSettled([boardResponse, playerResponse]);
    setLobbyName('');
    router.push(`othello/${boardResponse.id}`);
  };

  return (
    <form className={styles.wrapper} onSubmit={createLobby}>
      <input
        type="text"
        placeholder="Insert a lobby name"
        value={lobbyName}
        onChange={inputLobbyName}
      />
      <button type="submit">Create</button>
    </form>
  );
};

export default CreateLobby;
