import { useCallback, useEffect, useState } from 'react';
import {
  UpdateHookParams,
  UpdateHookReturnValue,
  UpdateStatus,
  VersionFileResponse,
} from './types';

const reloadPage = () => window.location.reload(true);

const currentVersion = window.__APP_VERSION__;

export const useUpdateCheck = ({
  interval,
  type,
  ignoreServerCache,
}: UpdateHookParams): UpdateHookReturnValue => {
  const [status, setStatus] = useState<UpdateStatus>(UpdateStatus.checking);

  const checkUpdate = useCallback(() => {
    if (typeof currentVersion === 'undefined') {
      setStatus(UpdateStatus.current);
      return;
    }

    setStatus(UpdateStatus.checking);

    let requestStr = `/${window.__APP_VERSION_FILE__}`;

    if (ignoreServerCache) {
      requestStr += `?v=${Date.now()}`;
    }

    fetch(requestStr)
      .then((res) => res.json() as Promise<VersionFileResponse>)
      .then((data) => {
        if (data.version === currentVersion) {
          setStatus(UpdateStatus.current);
        } else {
          setStatus(UpdateStatus.available);
        }
      })
      .catch(() => {
        setStatus(UpdateStatus.current);
      });
  }, [ignoreServerCache]);

  useEffect(() => {
    if (type !== 'manual') {
      checkUpdate();
    }
  }, [checkUpdate, type]);

  useEffect(() => {
    if (status !== UpdateStatus.current) {
      return;
    }

    if (type === 'interval') {
      const timeoutId = window.setTimeout(
        () => checkUpdate(),
        interval || 10000
      );

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [type, interval, status, checkUpdate]);

  return { status, reloadPage, checkUpdate };
};
