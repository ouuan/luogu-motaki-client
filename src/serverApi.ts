import axios from 'axios';
import log from './log';
import { FinishJob, Job, JobStatus } from './types';

export async function newJob(serverUrl: string, names: string[]): Promise<Job | null> {
  try {
    const response = await axios.post(`${serverUrl}/job/new`, { names });
    if (response.status === 200) return response.data;
    return null;
  } catch (e) {
    log('error', `POST ${serverUrl}/job/new`);
    return null;
  }
}

export async function finishJob(serverUrl: string, finish: FinishJob): Promise<JobStatus | null> {
  try {
    const response = await axios.post(`${serverUrl}/job/finish`, finish);
    if (response.status === 200) return response.data.status;
    return null;
  } catch (e) {
    log('error', `POST ${serverUrl}/job/finish`);
    return null;
  }
}
