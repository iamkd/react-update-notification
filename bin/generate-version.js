#!/usr/bin/env node
'use strict';

const path = require('path');
const fs = require('fs');
const cheerio = require('cheerio');
const yargs = require('yargs');

function getVersion(strategy) {
  if (strategy === 'latest-commit') {
    return require('child_process')
      .execSync('git rev-parse --short HEAD')
      .toString()
      .trim();
  }

  return process.env.npm_package_version;
}

function generate(argv) {
  const appVersion = getVersion(argv.s);

  const versionPath = path.resolve(process.cwd(), argv.b, argv.v);
  const indexPath = path.resolve(process.cwd(), argv.b, argv.i);

  try {
    fs.writeFileSync(versionPath, JSON.stringify({ version: appVersion }));
  } catch (e) {
    if (e.code === 'ENOENT') {
      console.error(
        `Error: incorrect path to version file. Path used: ${e.path}`,
      );
    } else {
      console.log(e);
    }
    process.exit(1);
  }

  let indexFile;

  try {
    indexFile = fs.readFileSync(indexPath);
  } catch (e) {
    if (e.code === 'ENOENT') {
      console.error(
        `Error: incorrect path to index.html. Path used: ${e.path}`,
      );
    } else {
      console.log(e);
    }
    process.exit(1);
  }

  const loadedIndex = cheerio.load(indexFile.toString());
  loadedIndex('head').append(
    `<script>window.__APP_VERSION__ = "${appVersion}"; window.__APP_VERSION_FILE__ = "${argv.p}${argv.v}"</script>`,
  );
  fs.writeFileSync(indexPath, loadedIndex.html());
}

const argv = yargs
  .usage('Usage: $0 [options]')
  .option('strategy', {
    alias: 's',
    description: 'What source to use to generate version',
    choices: ['latest-commit', 'package'],
    nargs: 1,
    default: 'latest-commit',
  })
  .option('buildPath', {
    alias: 'b',
    description: 'The build root',
    nargs: 1,
    default: 'build',
  })
  .option('indexFile', {
    alias: 'i',
    description: 'Path to index.html relative to build root',
    nargs: 1,
    default: 'index.html',
  })
  .option('versionFile', {
    alias: 'v',
    description: 'Version file target path relative to build root',
    nargs: 1,
    default: 'version.json',
  })
  .option('versionFilePathPrefix', {
    alias: 'p',
    description: 'A prefix to add before the versionFile option',
    nargs: 1,
    default: '',
  })
  .example('$0 -b build/my-custom-build-root')
  .example('$0 -i index.html')
  .example('$0 -i index.html -v version.json')
  .version(false)
  .help().argv;

generate(argv);
