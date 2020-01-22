# react-update-notification &middot; [![npm version](https://img.shields.io/npm/v/react-update-notification.svg?style=flat)](https://www.npmjs.com/package/react-update-notification)

A small cli tool & React hook to check when your app is updated and show a notification.

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

1. Injecting current version number into `window` object in `index.html` and creating `version.json` file to check for a new version.
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

`generate-version` accepts several types of strategies to differentiate versions and trigger the update notification:

- `latest-commit` uses current commit hash.
- `package` uses package.json `version` field.

<!-- `generate-version` accepts custom paths to `index.html` and to target `version.json` like this:

```bash
generate-version -i build/customIndex.html -v build/customVersionFile.json
``` -->

### 2. Using a React hook

```jsx
import React from 'react';
import { useUpdateCheck } from 'react-update-notification';

const NotificationContainer = () => {
  const { status, reloadPage } = useUpdateCheck({
    type: 'interval',
    interval: 10000
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

## TODO

- [ ] Define behavior when version file is broken / does not exist
- [x] Custom strategies for version generation (package.json, commit id)
- [ ] Custom paths to `generate-version`
- [x] Hook options (checking update using interval)
- [ ] Proper documentation, tests and build
