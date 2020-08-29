## [Unreleased]

## [1.0.0] - 2020-08-29

### Added

- New `manual` check mode.
- Export `checkUpdate` to allow manual checking.
- More parameters for `generate-version` utility:
  build root path, HTML index file path, JSON version file path. (view [README.md](README.md))

### Changed

- Replaced `setInterval` with `setTimeout` to provide smarter checks and avoid unnecessary rerenders.
- Checks stop if the new version is detected.

[unreleased]: https://github.com/iamkd/react-update-notification/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/iamkd/react-update-notification/releases/tag/v1.0.0
