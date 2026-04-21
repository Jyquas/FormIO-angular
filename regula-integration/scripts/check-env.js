#!/usr/bin/env node

function parseMajor(version) {
  var raw = String(version || '').trim().replace(/^v/, '');
  var major = Number(raw.split('.')[0]);
  return Number.isFinite(major) ? major : null;
}

function fail(message) {
  console.error('\n[env-check] ' + message + '\n');
  process.exit(1);
}

var nodeMajor = parseMajor(process.versions && process.versions.node);
if (nodeMajor === null || nodeMajor < 18 || nodeMajor >= 21) {
  fail(
    'Unsupported Node.js version: ' +
      (process.versions && process.versions.node ? process.versions.node : 'unknown') +
      '. This branch requires Node >=18 and <21.\n' +
      'Tip: use Node 18.x or 20.x before running npm install.'
  );
}

var npmUA = String(process.env.npm_config_user_agent || '');
var npmMatch = npmUA.match(/npm\/(\d+)\./);
var npmMajor = npmMatch ? Number(npmMatch[1]) : null;
if (npmMajor === null || npmMajor !== 9) {
  fail(
    'Unsupported npm version' +
      (npmMatch ? ': ' + npmMatch[1] + '.x' : '.') +
      ' This branch targets npm 9.x (pinned to 9.5.0 in packageManager).\n' +
      'Tip: run `npm i -g npm@9.5.0` and retry.'
  );
}

console.log('[env-check] Node ' + process.versions.node + ' and npm ' + npmMajor + '.x are supported.');
