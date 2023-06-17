import { staticPath } from 'src/utils/$path';
import { loginWithGitHub } from 'src/utils/login';
import { useLoading } from '../@hooks/useLoading';
import styles from './index.module.css';

const Login = () => {
  const { addLoading, removeLoading } = useLoading();
  const login = async () => {
    addLoading();
    await loginWithGitHub();
    removeLoading();
  };

  return (
    <div
      className={styles.container}
      style={{ background: `center/cover url('${staticPath.images.othello_images_jpg}')` }}
    >
      <div className={styles.main}>
        <div className={styles.title}>Online Othello</div>
        <div style={{ marginTop: '16px' }} onClick={login}>
          <div className={styles.btn}>
            {/* <GithubIcon size={18} fill="#fff" /> */}
            <span>Login</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
