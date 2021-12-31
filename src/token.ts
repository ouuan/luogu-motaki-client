/* eslint-disable no-await-in-loop */
import sleep from 'sleep-promise';
import { CD } from './constants';
import log from './log';
import paint from './paintboardApi';
import { finishJob, newJob } from './serverApi';
import { JobSuccess, Subscription } from './types';

export default class Token {
  failInARow = 0;

  async getJob(): Promise<[string, JobSuccess]> {
    while (true) {
      for (const { url, names } of this.subscriptions) {
        const job = await newJob(url, names);
        if (job?.status === 'success') {
          return [url, job];
        }
      }
      await sleep(1000);
    }
  }

  async paintRetry({ x, y, col }: JobSuccess) {
    for (let i = 0; i < 10; i += 1) {
      const result = await paint({
        x,
        y,
        col,
        token: this.token,
      });
      if (result) return true;
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

    await finishJob(url, {
      x,
      y,
      uuid,
      success,
    });

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

    setTimeout(() => this.getJobAndDoIt(), success ? CD - 500 : CD / 2);
  }

  constructor(public token: string, public subscriptions: Subscription[]) {
    this.getJobAndDoIt();
  }
}
