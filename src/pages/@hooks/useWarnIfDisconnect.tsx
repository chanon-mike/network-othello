import { Router } from 'next/router';
import { useEffect } from 'react';

export const useWarnIfDisconnect = (isDisconnected = true) => {
  useEffect(() => {
    if (isDisconnected) {
      const routeChangeStart = () => {
        const ok = confirm('Do you really want to leave the game?');
        if (!ok) {
          Router.events.emit('routeChangeError');
          throw 'Abort route change. Please ignore this error.';
        }
      };
      Router.events.on('routeChangeStart', routeChangeStart);

      return () => {
        Router.events.off('routeChangeStart', routeChangeStart);
      };
    }
  }, [isDisconnected]);
};

export default useWarnIfDisconnect;
