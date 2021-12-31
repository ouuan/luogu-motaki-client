/* eslint-disable no-console */
import axios from 'axios';
import { PAINTBOARD_URL } from './constants';
import { Paint } from './types';

export default async function paint(data: Paint): Promise<boolean> {
  let verdict = 'UNKNOWN';
  try {
    const response = await axios.post(`${process.env.LUOGU_MOTAKI_PAINTBOARD_URL || PAINTBOARD_URL}/paint`, data);
    verdict = response.status.toString();
    return response.status === 200;
  } catch (e) {
    console.error(e);
    verdict = 'ERROR';
    return false;
  } finally {
    const uid = data.token.split(':')[0];
    console.log(`${verdict.padEnd(7)} ${uid.padStart(7)}: (${data.x}, ${data.y}, ${data.col})`);
  }
}
