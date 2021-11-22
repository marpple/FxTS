import { compact, filter, map, pipe, toArray, toAsync } from "../../src/index";
import { Concurrent } from "../../src/Lazy/concurrent";
import { generatorMock } from "../utils";

describe("compact", function () {
  describe("sync", function () {
    it(`should be excluded 'null' 'undefined' - number`, () => {
      const acc = [];
      for (const a of compact([0, 1, undefined, 3, null, 5])) {
        acc.push(a);
      }
      expect(acc).toEqual([0, 1, 3, 5]);
    });

    it("should be excluded 'null' 'undefined' - string", function () {
      const acc = [];
      for (const a of compact(["", "a", undefined, "b", null])) {
        acc.push(a);
      }
      expect(acc).toEqual(["", "a", "b"]);
    });

    it("should be able to be used as a curried function in the pipeline", function () {
      const res = pipe(
        [1, undefined, 3, 4, 5, null, 7, 8],
        compact,
        map((a) => a + 10),
        filter((a) => a % 2 === 0),
        toArray,
      );

      expect(res).toEqual([14, 18]);
    });
  });

  describe("async", function () {
    it("should be excluded 'null' 'undefined' - number", async function () {
      const acc = [];
      for await (const a of compact(toAsync([0, 1, undefined, 3, null, 5]))) {
        acc.push(a);
      }
      expect(acc).toEqual([0, 1, 3, 5]);
    });

    it("should be excluded 'null' 'undefined' - string", async function () {
      const acc = [];
      for await (const a of compact(toAsync(["", "a", undefined, "b", null]))) {
        acc.push(a);
      }
      expect(acc).toEqual(["", "a", "b"]);
    });

    it("should be able to be used as a curried function in the pipeline", async function () {
      const res = await pipe(
        toAsync([1, undefined, 3, 4, 5, null, 7, 8]),
        compact,
        map((a) => a + 10),
        filter((a) => a % 2 === 0),
        toArray,
      );

      expect(res).toEqual([14, 18]);
    });

    it("should be passed concurrent object when job works concurrently", async function () {
      const mock = generatorMock();
      const iter = compact(mock);
      const concurrent = Concurrent.of(2) as any;

      await iter.next(concurrent);
      expect((mock as any).getConcurrent()).toEqual(concurrent);
    });
  });
});
