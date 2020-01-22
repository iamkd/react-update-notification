import { useState, useEffect } from 'react';

declare global {
  interface Window {
    __APP_VERSION__: string;
  }
}

interface VersionResponse {
  version: string;
}

type Status = 'checking' | 'current' | 'available';

const reloadPage = () => window.location.reload(true);

const currentVersion = window.__APP_VERSION__;

export const useUpdateCheck = () => {
  const [status, setStatus] = useState<Status>('checking');

  useEffect(() => {
    if (typeof currentVersion === 'undefined') {
      setStatus('current');
      return;
    }

    fetch('/version.json')
      .then(res => res.json() as Promise<VersionResponse>)
      .then(data => {
        if (data.version === currentVersion) {
          setStatus('current');
        } else {
          setStatus('available');
        }
      });
  }, []);

  return { status, reloadPage };
};
