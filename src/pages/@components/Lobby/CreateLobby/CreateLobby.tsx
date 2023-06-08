import type { ChangeEvent, FormEvent } from 'react';
import styles from './CreateLobby.module.css';

type CreateLobbyProps = {
  lobbyName: string;
  inputLobbyName: (e: ChangeEvent<HTMLInputElement>) => void;
  createLobby: (e: FormEvent) => Promise<void>;
};

export const CreateLobby = ({ lobbyName, inputLobbyName, createLobby }: CreateLobbyProps) => {
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
