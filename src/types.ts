export interface JobSuccess {
  status: 'success';
  uuid: string;
  x: number;
  y: number;
  color: number;
  timeLimit: number;
}

export interface JobFinished {
  status: 'finished';
}

export interface JobBlocked {
  status: 'blocked';
  blockedUntil: number;
}

export interface JobNotFound {
  status: 'not-found';
  validNames: string[];
}

export type Job = JobSuccess | JobFinished | JobBlocked | JobNotFound;

export interface FinishJob {
  x: number;
  y: number;
  uuid: string;
  success: boolean;
}

export type JobStatus = 'success' | 'failed' | 'unverified' | 'error';

export interface Paint {
  x: number;
  y: number;
  color: number;
  token: string;
}

export interface Subscription {
  url: string;
  names: string[];
}
