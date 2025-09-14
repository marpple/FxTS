import { debounce } from "../../src";

jest.useFakeTimers();

describe("debounce", () => {
  let callback: jest.Mock;

  beforeEach(() => {
    callback = jest.fn();
  });

  test("should delay the function call", () => {
    const debounced = debounce(callback, 100);

    debounced();
    expect(callback).not.toBeCalled();

    jest.advanceTimersByTime(50);
    expect(callback).not.toBeCalled();

    jest.advanceTimersByTime(50);
    expect(callback).toBeCalledTimes(1);
  });

  test("should reset delay if called again before wait time", () => {
    const debounced = debounce(callback, 100);

    debounced();
    jest.advanceTimersByTime(50);
    debounced();
    jest.advanceTimersByTime(50);
    expect(callback).not.toBeCalled();

    jest.advanceTimersByTime(50);
    expect(callback).toBeCalledTimes(1);
  });

  test("should call immediately if immediate is true", () => {
    const debounced = debounce(callback, 100, { leading: true });

    debounced();
    expect(callback).toBeCalledTimes(1);

    debounced();
    debounced();
    expect(callback).toBeCalledTimes(1);

    jest.advanceTimersByTime(100);

    debounced();
    expect(callback).toBeCalledTimes(2);
  });

  test("should use latest arguments", () => {
    const cb = jest.fn((val: number) => val);
    const debounced = debounce(cb, 100);

    debounced(1);
    debounced(2);
    debounced(3);

    jest.advanceTimersByTime(100);
    expect(cb).toBeCalledWith(3);
    expect(cb).toBeCalledTimes(1);
  });

  test("should cancel the delayed execution", () => {
    const debounced = debounce(callback, 100);

    debounced();
    debounced.cancel();

    jest.advanceTimersByTime(100);
    expect(callback).not.toBeCalled();
  });
});
