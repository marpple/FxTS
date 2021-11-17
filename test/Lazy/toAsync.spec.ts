import { delay, toAsync } from "../../src/index";

describe("toAsync", function () {
  describe("sync", function () {
    it("should convert 'Iterable<A>' to 'AsyncIterable<A>'", async function () {
      const asyncIter = toAsync([1, 2, 3, 4, 5]);

      let acc = 0;
      for await (const item of asyncIter) {
        acc += item;
      }
      expect(acc).toEqual(15);
    });
  });

  describe("async", function () {
    it("should convert 'Iterable<Promise<A>> to 'AsyncIterable<A>'", async function () {
      const asyncIter = toAsync([
        Promise.resolve(1),
        Promise.resolve(2),
        Promise.resolve(3),
        Promise.resolve(4),
        Promise.resolve(5),
      ]);

      let acc = 0;
      for await (const item of asyncIter) {
        acc += item;
      }
      expect(acc).toEqual(15);
    });

    it("should be consumed 'AsyncIterable' as many times as called with 'next'", async function () {
      const asyncIter = toAsync([
        Promise.resolve(1),
        Promise.resolve(2),
        Promise.resolve(3),
        Promise.resolve(4),
        Promise.resolve(5),
      ]);

      expect((await asyncIter.next()).value).toEqual(1);
      expect((await asyncIter.next()).value).toEqual(2);
      expect((await asyncIter.next()).value).toEqual(3);
      expect((await asyncIter.next()).value).toEqual(4);
      expect((await asyncIter.next()).value).toEqual(5);
      expect((await asyncIter.next()).value).toEqual(undefined);
    });

    it("should be able to handle concurrently", async function () {
      const asyncIter = toAsync(
        (function* () {
          yield delay(1000, 1);
          yield delay(1000, 2);
          yield delay(1000, 3);
          yield delay(1000, 4);
          yield delay(1000, 5);
        })(),
      );

      await Promise.all([
        asyncIter.next().then(({ value }) => value),
        asyncIter.next().then(({ value }) => value),
        asyncIter.next().then(({ value }) => value),
        asyncIter.next().then(({ value }) => value),
        asyncIter.next().then(({ value }) => value),
      ]);
    }, 1050);
  });
});
