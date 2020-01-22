#!/usr/bin/env node
'use strict';

const path = require('path');
const fs = require('fs');
const cheerio = require('cheerio');
const yargs = require('yargs');

const version = process.env.npm_package_version;

function generate(argv) {
  const versionPath = path.resolve(process.cwd(), argv.v);
  const indexPath = path.resolve(process.cwd(), argv.i);

  try {
    fs.writeFileSync(versionPath, JSON.stringify({ version }));
  } catch (e) {
    if (e.code === 'ENOENT') {
      console.error(
        `Error: incorrect path to version file. Path used: ${e.path}`
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
        `Error: incorrect path to index.html. Path used: ${e.path}`
      );
    } else {
      console.log(e);
    }
    process.exit(1);
  }

  const loadedIndex = cheerio.load(indexFile.toString());
  loadedIndex('head').append(
    `<script>window.__APP_VERSION__ = "${version}"; window.__APP_VERSION_FILE__ = "${argv.v}"</script>`
  );
  fs.writeFileSync(indexPath, loadedIndex.html());
}

const argv = yargs
  .usage('Usage: $0 [options]')
  .option('indexFile', {
    alias: 'i',
    description: 'Path to index.html',
    nargs: 1,
    default: 'build/index.html'
  })
  .option('versionFile', {
    alias: 'v',
    description: 'Version file target path',
    nargs: 1,
    default: 'build/version.json'
  })
  .example('$0 -i build/index.html')
  .example('$0 -i build/index.html -v build/version.json')
  .version(false)
  .help().argv;

generate(argv);
