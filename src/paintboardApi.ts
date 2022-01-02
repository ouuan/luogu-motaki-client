import axios from 'axios';
import { PAINTBOARD_URL, REQUIRED_REFERER } from './constants';
import log from './log';
import { Paint } from './types';

export default async function paint(data: Paint, token: string): Promise<number> {
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
    return response.status;
  } catch (e) {
    const response = (e as any)?.response;
    if (response) {
      // eslint-disable-next-line no-console
      console.error(response.data);
      verdict = response.status.toString();
      return response.status;
    }
    verdict = 'ERROR';
    return -1;
  } finally {
    const uid = token.split(':')[0];
    log('info', `${uid.padStart(7)}: (${data.x}, ${data.y}, ${data.color})`, verdict);
  }
}
