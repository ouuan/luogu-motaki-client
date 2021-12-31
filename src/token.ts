/* eslint-disable no-await-in-loop */
import sleep from 'sleep-promise';
import { CD } from './constants';
import log from './log';
import paint from './paintboardApi';
import { finishJob, newJob } from './serverApi';
import { JobSuccess, Subscription } from './types';

export default class Token {
  failInARow = 0;

  nextCd = 0;

  async getJob(): Promise<[string, JobSuccess]> {
    while (true) {
      for (const { url, names } of this.subscriptions) {
        const job = await newJob(url, names);
        if (job?.status === 'success') {
          return [url, job];
        }
        if (job?.status === 'blocked') {
          log('warn', `blocked by ${url} until ${new Date(job.blockedUntil).toLocaleTimeString()}`);
        }
        if (job?.status === 'not-found') {
          log('error', `task not found: ${names.join(', ')}`);
        }
      }
      await sleep(1000);
    }
  }

  async paintRetry({ x, y, color }: JobSuccess) {
    for (let i = 0; i < 10; i += 1) {
      const result = await paint({
        x,
        y,
        color,
        token: this.token,
      });
      if (result) {
        this.nextCd = new Date().valueOf() + CD;
        return true;
      }
      await sleep(500);
    }
    return false;
  }

  async doJob(job: JobSuccess, url: string) {
    async function waitTimeLimit() {
      await sleep(Math.max(1000, job.timeLimit - new Date().valueOf() - 5000));
      return false;
    }

    const success = await Promise.any([this.paintRetry(job), waitTimeLimit()]);

    const { x, y, uuid } = job;

    const jobStatus = await finishJob(url, {
      x,
      y,
      uuid,
      success,
    });

    if (jobStatus !== 'success') {
      log('warn', `${this.token.split(':')[0]}: job status of ${url} is ${jobStatus}`);
    }

    return success;
  }

  async getJobAndDoIt() {
    const [url, job] = await this.getJob();
    const success = await this.doJob(job, url);

    if (success) this.failInARow = 0;
    else this.failInARow += 1;

    if (this.failInARow >= 3) {
      log('warn', `${this.token} failed ${this.failInARow} times in a row`);
      if (this.failInARow >= 5) {
        log('error', `stopped ${this.token}`);
        return;
      }
    }

    setTimeout(
      () => this.getJobAndDoIt(),
      success ? Math.max(500, this.nextCd - new Date().valueOf()) : CD / 2,
    );
  }

  constructor(public token: string, public subscriptions: Subscription[]) {
    this.getJobAndDoIt();
  }
}
