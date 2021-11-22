import { filter, map, pipe, toArray, toAsync, uniq } from "../../src/index";
import { Concurrent } from "../../src/Lazy/concurrent";
import { generatorMock } from "../utils";

describe("uniq", function () {
  describe("sync", function () {
    it("should be removed duplicate values", function () {
      const res1 = uniq("marpple");
      expect([...res1]).toEqual(["m", "a", "r", "p", "l", "e"]);

      const res2 = uniq([1, 2, 3, 4]);
      expect([...res2]).toEqual([1, 2, 3, 4]);
    });

    it("should be removed duplicate values object", function () {
      const res1 = toArray(
        uniq([{ v: 1 }, { v: 1 }, { v: 1 }, { v: 1 }, { v: 1 }]),
      );
      expect(res1).toEqual([{ v: 1 }, { v: 1 }, { v: 1 }, { v: 1 }, { v: 1 }]);
    });

    it("should be able to be used as a curried function in the pipeline", function () {
      const res = pipe(
        [1, 2, 3, 4, 4, 2],
        map((a) => a + 10),
        filter((a) => a % 2 === 0),
        uniq,
        toArray,
      );

      expect(res).toEqual([12, 14]);
    });
  });

  describe("async", function () {
    it("should be removed duplicate values", async function () {
      const res1 = await toArray(uniq(toAsync("marpple")));
      expect(res1).toEqual(["m", "a", "r", "p", "l", "e"]);

      const res2 = await toArray(uniq(toAsync([1, 2, 3, 4])));
      expect(res2).toEqual([1, 2, 3, 4]);
    });

    it("should be able to be used as a curried function in the pipeline", async function () {
      const res = await pipe(
        toAsync([1, 2, 3, 4, 4, 2]),
        map((a) => a + 10),
        filter((a) => a % 2 === 0),
        uniq,
        toArray,
      );

      expect(res).toEqual([12, 14]);
    });

    it("should be passed concurrent object when job works concurrently", async function () {
      const mock = generatorMock();
      const iter = uniq(mock);
      const concurrent = Concurrent.of(2) as any;

      await iter.next(concurrent);
      expect((mock as any).getConcurrent()).toEqual(concurrent);
    });
  });
});
