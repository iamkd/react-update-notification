# react-update-notification &middot; [![npm version](https://img.shields.io/npm/v/react-update-notification.svg?style=flat)](https://www.npmjs.com/package/react-update-notification)

A small CLI tool & React hook to check when your app has a new version and show a notification.
Works great when you cannot or do not want to set up a service worker.

## Installation

```bash
yarn add react-update-notification
```

or

```bash
npm i -S react-update-notification
```

## Usage

This tool works in two steps:

1. Injecting current version number into `window` object in `index.html` and creating a `version.json` file to check for a new version.
2. Providing a React hook to build a custom update notification component.

### 1. Adding CLI command after build

In your `package.json`, add call to `generate-version` after the build is created.

```json
{
  "scripts": {
    "build": "react-scripts build && generate-version -s package"
  }
}
```

#### CLI Options

|        Option         | Description                                                                                                                                                                                                                                             |     Default     |
| :-------------------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------: |
|  `-s`, `--strategy`   | Set strategy. The update notification will trigger when the version string in the JSON file is different from the version string in the HTML file. <br><br> `latest-commit` uses current commit hash. <br> `package` uses package.json `version` field. | `latest-commit` |
|  `-b`, `--buildPath`  | Set custom build path. This should be the root of the public directory that is served.                                                                                                                                                                  |     `build`     |
|  `-i`, `--indexFile`  | Path to index.html relative to build path.                                                                                                                                                                                                              |  `index.html`   |
| `-v`, `--versionFile` | Version file target path relative to build path.                                                                                                                                                                                                        | `version.json`  |
| `-p`, `--versionFilePathPrefix` | A prefix to add before the versionFile option above (useful for more control over the deployed version file target path e.g. when using subdirectories to host your React app).|   |

### 2. Using a React hook

The `useUpdateCheck` hook returns:

- `status` string that can be `'checking'`, `'current'` or `'available'`.
- `reloadPage` helper function that reloads the page.
- `checkUpdate` function to manually trigger the update check.

It supports three check types:

- `interval` checks on component mount and then every set period defined by `interval` property (10 seconds by default).
- `mount` checks only on component mount.
- `manual` does not check at all. It is used to check with `checkUpdate`.

```jsx
import React from 'react';
import { useUpdateCheck } from 'react-update-notification';

const NotificationContainer = () => {
  const { status, reloadPage } = useUpdateCheck({
    type: 'interval',
    interval: 10000,
  });

  if (status === 'checking' || status === 'current') {
    return null;
  }

  return (
    <div>
      <button type="button" onClick={reloadPage}>
        Refresh to update the app
      </button>
    </div>
  );
};
```
