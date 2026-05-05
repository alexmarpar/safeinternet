let queue: Promise<any> = Promise.resolve();

export function runSerial<T>(fn: () => Promise<T>): Promise<T> {
  const result = queue.then(() => fn());

  queue = result.catch(() => {});

  return result;
}