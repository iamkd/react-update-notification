declare global {
  interface Window {
    __APP_VERSION__: string;
    __APP_VERSION_FILE__: string;
  }
}

export interface VersionFileResponse {
  version: string;
}

export interface UpdateHookParams {
  type: 'mount' | 'interval' | 'manual';
  interval?: number;
  ignoreServerCache?: boolean;
}

export enum UpdateStatus {
  checking = 'checking',
  current = 'current',
  available = 'available',
}

export interface UpdateHookReturnValue {
  status: UpdateStatus;
  reloadPage: () => void;
  checkUpdate: () => void;
}
