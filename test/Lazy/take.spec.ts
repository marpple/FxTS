import {
  delay,
  filter,
  map,
  pipe,
  range,
  take,
  toArray,
  toAsync,
} from "../../src/index";
import { Concurrent } from "../../src/Lazy/concurrent";
import { generatorMock } from "../utils";

describe("take", function () {
  describe("sync", function () {
    it("should be able to take the element", function () {
      const res = [];
      for (const item of take(1, [1, 2, 3, 4])) {
        res.push(item);
      }
      expect(res).toEqual([1]);

      const res1 = toArray(take(1, [1, 2, 3, 4]));
      expect(res1).toEqual([1]);

      const res2 = toArray(take(2, [1, 2, 3, 4]));
      expect(res2).toEqual([1, 2]);

      const res3 = toArray(take(4, [1, 2, 3, 4]));
      expect(res3).toEqual([1, 2, 3, 4]);

      const res5 = toArray(take(4, [1, 2, 3, 4]));
      expect(res5).toEqual([1, 2, 3, 4]);

      const res6 = toArray(take(5, [1, 2, 3, 4]));
      expect(res6).toEqual([1, 2, 3, 4]);

      const res7 = toArray(take(-1, [1, 2, 3, 4]));
      expect(res7).toEqual([]);
    });

    it("should be able to be used as a curried function in the pipeline", function () {
      const res1 = pipe(
        [1, 2, 3, 4],
        map((a) => a + 10),
        filter((a) => a % 2 === 0),
        take(2),
        toArray,
      );

      expect(res1).toEqual([12, 14]);
    });

    it("should be able to take the rest element", async function () {
      const iter = take(5, range(1, 11));
      iter.next();
      iter.next();
      let sum = 0;
      for (const item of iter) {
        sum += item;
      }
      expect(sum).toEqual(3 + 4 + 5);
    });
  });

  describe("async", function () {
    it("should be able to take the element", async function () {
      const res = [];
      for await (const item of take(1, toAsync([1, 2, 3, 4]))) {
        res.push(item);
      }
      expect(res).toEqual([1]);

      const res1 = await toArray(take(1, toAsync([1, 2, 3, 4])));
      expect(res1).toEqual([1]);

      const res2 = await toArray(take(2, toAsync([1, 2, 3, 4])));
      expect(res2).toEqual([1, 2]);

      const res3 = await toArray(take(4, toAsync([1, 2, 3, 4])));
      expect(res3).toEqual([1, 2, 3, 4]);

      const res5 = await toArray(take(4, toAsync([1, 2, 3, 4])));
      expect(res5).toEqual([1, 2, 3, 4]);

      const res6 = await toArray(take(5, toAsync([1, 2, 3, 4])));
      expect(res6).toEqual([1, 2, 3, 4]);

      const res7 = await toArray(take(-1, toAsync([1, 2, 3, 4])));
      expect(res7).toEqual([]);
    });

    it("should be able to be used as a curried function in the pipeline", async function () {
      const res1 = await pipe(
        toAsync([1, 2, 3, 4]),
        map((a) => a + 10),
        filter((a) => a % 2 === 0),
        take(2),
        toArray,
      );

      expect(res1).toEqual([12, 14]);
    });
    it("should be able to take the element concurrently", async function () {
      const asyncIterator = take(
        3,
        toAsync(
          (function* () {
            yield delay(1000, 1);
            yield delay(1000, 2);
            yield delay(1000, 3);
            yield delay(1000, 4);
            yield delay(1000, 5);
          })(),
        ),
      );
      const [n1, n2, n3] = await Promise.all([
        asyncIterator.next().then(({ value }) => value),
        asyncIterator.next().then(({ value }) => value),
        asyncIterator.next().then(({ value }) => value),
      ]);

      expect(n1 + n2 + n3).toEqual(1 + 2 + 3);
    }, 1050);

    it("should be passed concurrent object when job works concurrently", async function () {
      const mock = generatorMock();
      const iter = take(1, mock);
      const concurrent = Concurrent.of(2) as any;

      await iter.next(concurrent);
      expect((mock as any).getConcurrent()).toEqual(concurrent);
    });
  });
});
