import { concurrentPool, delay, pipe, toAsync } from "../../src/index";

describe("concurrentPool", function () {
  it("should be consumed 'AsyncIterable' concurrently", async function () {
    const res = concurrentPool(
      2,
      toAsync(
        (function* () {
          yield delay(300, 1);
          yield delay(1000, 2);
          yield delay(600, 3);
          yield delay(1000, 4);
          yield delay(600, 5);
          yield delay(300, 6);
        })(),
      ),
    );
    const acc = [];
    for await (const item of res) {
      acc.push(item);
    }
    expect(acc).toEqual([1, 2, 3, 4, 5, 6]);
  }, 1950);

  it("should be able to be used as a curried function in the pipeline", async function () {
    const iter = pipe(
      toAsync(
        (function* () {
          yield delay(300, 1);
          yield delay(1000, 2);
          yield delay(300, 3);
          yield delay(1000, 4);
        })(),
      ),
      concurrentPool(2),
    );

    const acc = await Promise.all([
      iter.next(),
      iter.next(),
      iter.next(),
      iter.next(),
    ]).then((arr) => arr.map((a) => a.value));

    expect(acc).toEqual([1, 2, 3, 4]);
  }, 1650);

  it("should be able to handle an error when working concurrentPool", async function () {
    const fn = jest.fn();
    const res = concurrentPool(
      2,
      toAsync(
        (function* () {
          yield delay(100, 1);
          yield delay(1000, 2);
          yield delay(100, 3);
          yield (async () => {
            throw "err";
          })(),
            yield delay(100, 4);
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
      fn();
      expect(err).toEqual("err");
    }
    expect(fn).toBeCalled();
    expect(acc).toEqual([1, 2, 3]);
  }, 2050);
});
