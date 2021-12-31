import axios from 'axios';
import { PAINTBOARD_URL, REQUIRED_REFERER } from './constants';
import log from './log';
import { Paint } from './types';

export default async function paint(data: Paint, token: string): Promise<boolean> {
  let verdict = 'UNKNOWN';
  try {
    const response = await axios.post(
      `${process.env.LUOGU_MOTAKI_PAINTBOARD_URL || PAINTBOARD_URL}/paint`,
      data,
      {
        params: {
          token,
        },
        headers: {
          Referer: REQUIRED_REFERER,
        },
      },
    );
    verdict = response.status.toString();
    return response.status === 200;
  } catch (e) {
    const err = (e as any)?.response;
    if (err) {
      // eslint-disable-next-line no-console
      console.error(err.data);
      verdict = err.status.toString();
    } else verdict = 'ERROR';
    return false;
  } finally {
    const uid = token.split(':')[0];
    log('info', `${uid.padStart(7)}: (${data.x}, ${data.y}, ${data.color})`, verdict);
  }
}
