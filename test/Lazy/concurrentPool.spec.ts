import { concurrentPool, delay, pipe, toAsync } from "../../src/index";

describe("concurrentPool", function () {
  it("should be consumed 'AsyncIterable' concurrently (concurrency 1)", async function () {
    const res = concurrentPool(
      1,
      toAsync(
        (function* () {
          yield delay(1000, 1);
          yield delay(1000, 2);
          yield delay(1000, 3);
        })(),
      ),
    );
    const acc = [];
    for await (const item of res) {
      acc.push(item);
    }
    expect(acc).toEqual([1, 2, 3]);
  }, 3050);

  it("should be consumed 'AsyncIterable' concurrently (concurrency 2)", async function () {
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

  it("should be consumed 'AsyncIterable' concurrently (concurrency n)", async function () {
    const res = concurrentPool(
      3,
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
  }, 1350);

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
          })();
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

describe("concurrentPool regressions", function () {
  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  it("should deliver buffered items even when the next upstream fetch hangs", async function () {
    async function* fastThenHang() {
      yield 1;
      yield 2;
      yield 3;
      await new Promise(() => undefined); // upstream hangs on the 4th item
    }
    const iter = concurrentPool(3, fastThenHang())[Symbol.asyncIterator]();

    expect((await iter.next()).value).toBe(1);
    // let every pending pull-chain continuation drain
    await sleep(50);
    // items 2 and 3 are already buffered - they must not wait for a new fetch
    const result = await Promise.race([
      iter.next(),
      sleep(300).then(() => "TIMEOUT" as const),
    ]);
    expect(result).toEqual({ value: 2, done: false });
  });

  it("should keep prefetch bounded by the pool size with a slow consumer", async function () {
    let produced = 0;
    async function* fast() {
      for (let i = 0; i < 1000; i++) {
        produced++;
        yield i;
      }
    }
    const iter = concurrentPool(3, fast())[Symbol.asyncIterator]();
    let consumed = 0;
    for (let i = 0; i < 5; i++) {
      await iter.next();
      consumed++;
      await sleep(15);
    }
    // in-flight + buffered may run ahead of the consumer by at most the pool size
    expect(produced).toBeLessThanOrEqual(consumed + 3);
  });

  it("should not pull the source again after it has thrown", async function () {
    let pullsAfterThrow = 0;
    let thrown = false;
    const source: AsyncIterable<number> = {
      [Symbol.asyncIterator]() {
        let n = 0;
        return {
          async next() {
            if (thrown) {
              pullsAfterThrow++;
              return { value: undefined, done: true } as IteratorResult<number>;
            }
            if (n >= 1) {
              thrown = true;
              throw new Error("boom");
            }
            return { value: n++, done: false };
          },
        };
      },
    };
    const iter = concurrentPool(2, source)[Symbol.asyncIterator]();
    const results = [];
    try {
      for (let i = 0; i < 5; i++) {
        results.push(await iter.next());
      }
    } catch (e) {
      // first rejection is expected
    }
    await sleep(30);
    await iter.next().catch(() => undefined);
    await sleep(30);
    expect(pullsAfterThrow).toBe(0);
  });
});
