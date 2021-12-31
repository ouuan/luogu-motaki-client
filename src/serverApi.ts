import axios from 'axios';
import { FinishJob, Job, JobStatus } from './types';

export async function newJob(serverUrl: string, names: string[]): Promise<Job | null> {
  try {
    const response = await axios.get(`${serverUrl}/job/new`, { params: { names } });
    if (response.status === 200) return response.data;
    return null;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(`ERROR   GET ${serverUrl}/job/new`);
    return null;
  }
}

export async function finishJob(serverUrl: string, finish: FinishJob): Promise<JobStatus | null> {
  try {
    const response = await axios.post(`${serverUrl}/job/finish`, finish);
    if (response.status === 200) return response.data.status;
    return null;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(`ERROR   POST ${serverUrl}/job/finish`);
    return null;
  }
}
