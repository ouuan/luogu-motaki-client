export default function log(type: 'info' | 'warn' | 'error', msg: string, head?: string) {
  // eslint-disable-next-line no-console
  console[type](`${new Date().toISOString()} ${(head || type).toUpperCase().padStart(8)} ${msg}`);
}
