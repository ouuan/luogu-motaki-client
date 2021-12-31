import axios from 'axios';
import { PAINTBOARD_URL, REQUIRED_REFERER } from './constants';
import log from './log';
import { Paint } from './types';

export default async function paint(data: Paint): Promise<boolean> {
  let verdict = 'UNKNOWN';
  try {
    const response = await axios.post(`${process.env.LUOGU_MOTAKI_PAINTBOARD_URL || PAINTBOARD_URL}/paint`, data, {
      headers: {
        Referer: REQUIRED_REFERER,
      },
    });
    verdict = (response.status === 200 ? response.data.status : response.status).toString();
    return verdict === '200';
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    verdict = 'ERROR';
    return false;
  } finally {
    const uid = data.token.split(':')[0];
    log('info', `${uid.padStart(7)}: (${data.x}, ${data.y}, ${data.col})`, verdict);
  }
}
