import { readFileSync } from 'fs';
import Token from './token';
import { Subscription } from './types';

const config = readFileSync('motaki-config.txt');

const lines = config.toString().split('\n');

const uidUsed = new Set<string>();

let tokens: string[] = [];
let subscriptions: Subscription[] = [];

function start() {
  // eslint-disable-next-line no-console
  console.log(JSON.stringify({ tokens, subscriptions }, null, 2));
  tokens.forEach((token) => new Token(token, subscriptions));
  tokens = [];
  subscriptions = [];
}

for (const line of lines) {
  const parts = line.trim().split(/\s+/);
  if (parts[0].startsWith('---')) start();
  else if (parts[0].startsWith('http')) {
    subscriptions.push({
      url: parts[0],
      names: parts.slice(1),
    });
  } else if (/^\d+:.+$/.test(parts[0])) {
    const token = parts[0];
    const uid = token.split(':')[0];
    if (uidUsed.has(uid)) {
      // eslint-disable-next-line no-console
      console.error(`error: the uid ${uid} appeared more than once`);
      process.exit(1);
    }
    uidUsed.add(uid);
    tokens.push(token);
  }
}

start();
