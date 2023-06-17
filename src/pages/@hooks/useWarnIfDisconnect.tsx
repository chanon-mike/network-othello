import { Router } from 'next/router';
import { useEffect } from 'react';

export const useWarnIfDisconnect = (isDisconnected = true) => {
  useEffect(() => {
    if (isDisconnected) {
      const confirmExit = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        e.returnValue = 'Do you really want to leave the game?';
      };

      const routeChangeStart = () => {
        const ok = confirm('Do you really want to leave the game?');
        if (!ok) {
          Router.events.emit('routeChangeError');
          throw 'Abort route change. Please ignore this error.';
        }
      };

      window.addEventListener('beforeunload', confirmExit);
      Router.events.on('routeChangeStart', routeChangeStart);
      return () => {
        window.removeEventListener('beforeunload', confirmExit);
        Router.events.off('routeChangeStart', routeChangeStart);
      };
    }
  }, [isDisconnected]);
};

export default useWarnIfDisconnect;
