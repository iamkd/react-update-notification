import { useState, useEffect } from 'react';

declare global {
  interface Window {
    __APP_VERSION__: string;
  }
}

interface VersionFileResponse {
  version: string;
}

interface UpdateHookParams {
  type: 'mount' | 'interval';
  interval?: number;
}

type Status = 'checking' | 'current' | 'available';

const reloadPage = () => window.location.reload(true);

const currentVersion = window.__APP_VERSION__;

export const useUpdateCheck = (params: UpdateHookParams) => {
  const [status, setStatus] = useState<Status>('checking');

  const checkUpdate = () => {
    if (status === 'available') {
      return;
    }

    if (typeof currentVersion === 'undefined') {
      setStatus('current');
      return;
    }

    setStatus('checking');

    fetch('/version.json')
      .then(res => res.json() as Promise<VersionFileResponse>)
      .then(data => {
        if (data.version === currentVersion) {
          setStatus('current');
        } else {
          setStatus('available');
        }
      })
      .catch(err => {
        //TODO Define behavior when version file is broken / does not exist
      });
  };

  useEffect(() => {
    checkUpdate();
  }, []);

  useEffect(() => {
    if (params.type === 'interval') {
      const interval = setInterval(
        () => checkUpdate(),
        params.interval || 10000
      );

      return () => {
        clearInterval(interval);
      };
    }
  }, [params.type, params.interval]);

  return { status, reloadPage };
};
