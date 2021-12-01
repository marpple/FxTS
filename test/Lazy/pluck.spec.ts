import { filter, pipe, toArray, toAsync } from "../../src";
import pluck from "../../src/Lazy/pluck";

describe("pluck", function () {
  const given = [
    { id: 1, age: 21 },
    { id: 2, age: 22 },
    { id: 3, age: 23 },
    { id: 4, age: 24 },
  ];

  describe("sync", function () {
    it("should return Iterable by plucking the same named property off all objects in the Iterable supplied", function () {
      const acc = [];
      for (const a of pluck("age", given)) {
        acc.push(a);
      }
      expect(acc).toEqual([21, 22, 23, 24]);
    });

    it("should be able to be used as a curried function in the pipeline", function () {
      const res = pipe(
        given,
        pluck("age"),
        filter((a) => a > 21),
        toArray,
      );

      expect(res).toEqual([22, 23, 24]);
    });
  });

  describe("async", function () {
    it("should return Iterable by plucking the same named property off all objects in the Iterable supplied", async function () {
      const acc = [];
      for await (const a of pluck("age", toAsync(given))) {
        acc.push(a);
      }
      expect(acc).toEqual([21, 22, 23, 24]);
    });

    it("should be able to be used as a curried function in the pipeline", async function () {
      const res = await pipe(
        toAsync(given),
        pluck("age"),
        filter((a) => a > 21),
        toArray,
      );

      expect(res).toEqual([22, 23, 24]);
    });
  });
});
