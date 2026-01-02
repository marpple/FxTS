import { isPromise } from "./utils";

export class AsyncFunctionException extends Error {
  static MESSAGE = `'Iterable' can not used with async function.
If you want to deal with async function, see: [toAsync](https://fxts.dev/api/toAsync)`;

  constructor(message = AsyncFunctionException.MESSAGE) {
    super(message);
  }
}

export const throwIfPromiseError = <T>(a: Promise<T> | T): T => {
  if (isPromise(a)) {
    throw new AsyncFunctionException();
  }

  return a;
};
