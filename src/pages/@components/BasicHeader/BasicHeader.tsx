import type { UserModel } from '$/commonTypesWithClient/models';
import Image from 'next/image';
import Link from 'next/link';
import { HumanIcon } from 'src/components/icons/HumanIcon';
import { staticPath } from 'src/utils/$path';
import { logout } from 'src/utils/login';
import styles from './BasicHeader.module.css';

export const BasicHeader = ({ user }: { user: UserModel }) => {
  const onLogout = async () => {
    if (confirm('Logout?')) await logout();
  };

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <Link className={styles.headerIcon} href={'/'}>
          <Image src={staticPath.othello_header_png} height={40} width={160} alt="othello logo" />
        </Link>

        <div className={styles.userBtn} onClick={onLogout}>
          {user.photoURL ? (
            <img
              className={styles.userIcon}
              src={user.photoURL}
              height={24}
              alt={user.displayName}
            />
          ) : (
            <HumanIcon size={18} fill="#555" />
          )}
          <span className={styles.userName}>{user.displayName}</span>
        </div>
      </div>
    </div>
  );
};
