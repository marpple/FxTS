import {
  concurrent,
  delay,
  filter,
  map,
  peek,
  pipe,
  range,
  toAsync,
} from "../../src/index";
import { callFuncAfterTime } from "../utils";

describe("concurrent", function () {
  it("should be consumed 'AsyncIterable' concurrently", async function () {
    const fn = jest.fn();
    callFuncAfterTime(fn, 2000);
    const res = concurrent(
      2,
      toAsync(
        (function* () {
          yield delay(1000, 1);
          yield delay(1000, 2);
          yield delay(1000, 3);
          yield delay(1000, 4);
        })(),
      ),
    );
    const acc = [];
    for await (const item of res) {
      acc.push(item);
    }
    expect(fn).toBeCalled();
    expect(acc).toEqual([1, 2, 3, 4]);
  }, 2050);

  it("should be able to be used as a curried function in the pipeline", async function () {
    const fn = jest.fn();
    callFuncAfterTime(fn, 500);

    const iter = pipe(
      toAsync(range(1, 101)),
      map((a) => delay(100, a)),
      concurrent(2),
    );

    const arr = await Promise.all([
      iter.next(),
      iter.next(),
      iter.next(),
      iter.next(),
      iter.next(),
      iter.next(),
      iter.next(),
      iter.next(),
      iter.next(),
      iter.next(),
    ]).then((arr) => arr.map((a) => a.value));

    expect(fn).toBeCalled();
    expect(arr).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  }, 550);

  it("should be affected only one concurrent below it, when nested concurrent", async function () {
    let fn: jest.Mock<any, any>;
    fn = jest.fn();
    let concurrent10Count = 0;
    let concurrent2Count = 0;

    const iter = pipe(
      toAsync(range(Infinity)),
      peek(() => concurrent10Count++),
      map((a) => delay(100, a)),
      concurrent(10),
      peek(() => concurrent2Count++),
      map((a) => delay(100, a)),
      filter((a) => a % 2 === 0),
      concurrent(2),
    );

    callFuncAfterTime(fn, 300);
    await iter.next();
    await iter.next();
    expect(fn).toBeCalled();
    expect(concurrent2Count).toEqual(4);
    expect(concurrent10Count).toEqual(10);

    fn = jest.fn();
    callFuncAfterTime(fn, 200);
    await iter.next();
    await iter.next();
    expect(fn).toBeCalled();
    expect(concurrent2Count).toEqual(8);
    expect(concurrent10Count).toEqual(10);

    fn = jest.fn();
    callFuncAfterTime(fn, 300);
    await iter.next();
    await iter.next();
    expect(fn).toBeCalled();
    expect(concurrent2Count).toEqual(12);
    expect(concurrent10Count).toEqual(20);
  }, 850);

  it("should return IteratorReturnResult after all consuming 'AsyncIterable'", async function () {
    const fn = jest.fn();
    callFuncAfterTime(fn, 1000);
    const iter = concurrent(
      2,
      toAsync(
        (function* () {
          yield delay(1000, 1);
          yield delay(1000, 2);
        })(),
      ),
    );

    const [
      { value: v1, done: d1 },
      { value: v2, done: d2 },
      { value: v3, done: d3 },
      { value: v4, done: d4 },
    ] = await Promise.all([iter.next(), iter.next(), iter.next(), iter.next()]);

    expect(fn).toBeCalled();
    expect(v1).toEqual(1);
    expect(d1).toEqual(false);
    expect(v2).toEqual(2);
    expect(d2).toEqual(false);
    expect(v3).toEqual(undefined);
    expect(d3).toEqual(true);
    expect(v4).toEqual(undefined);
    expect(d4).toEqual(true);
  }, 1050);

  it("should be able to handle an error when working concurrent", async function () {
    const fn = jest.fn();
    callFuncAfterTime(fn, 2000);
    const res = concurrent(
      2,
      toAsync(
        (function* () {
          yield delay(1000, 1);
          yield delay(1000, 2);
          yield delay(1000, 3);
          yield (async () => {
            throw "err";
          })(),
            yield delay(1000, 4);
          yield delay(1000, 5);
        })(),
      ),
    );
    const acc = [];
    try {
      for await (const item of res) {
        acc.push(item);
      }
    } catch (err) {
      expect(err).toEqual("err");
    }
    expect(fn).toBeCalled();
    expect(acc).toEqual([1, 2, 3]);
  }, 2050);
});
