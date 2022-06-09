import { isPromise } from "./_internal/utils";

/**
 * Delays the value by given `wait` time
 *
 * @example
 * ```ts
 * await delay(1000);
 * console.log('hello'); // after 1000 milliseconds log hello
 * ```
 */
function delay(wait: number): Promise<void>;
function delay<T>(wait: number, value: T): Promise<T>;
function delay<T>(wait: number, value?: T): Promise<T | undefined> {
  return new Promise((resolve, reject) => {
    if (isPromise(value)) {
      value.catch(reject);
    }

    setTimeout(() => {
      resolve(value);
    }, wait);
  });
}

export default delay;
