import { toArray, toAsync } from "../../src";
import { Concurrent } from "../../src/Lazy/concurrent";
import intersectionBy from "../../src/Lazy/intersectionBy";
import { generatorMock } from "../utils";

describe("intersectionBy", function () {
  describe("sync", function () {
    it.each([
      [
        [{ x: 1 }, { x: 4 }],
        [{ x: 1 }, { x: 2 }, { x: 3 }],
        (a: any) => a.x,
        [{ x: 1 }],
      ],
      ["abcd", "cdefgc", (a: any) => a, ["c", "d"]],
    ])(
      "should return all elements in %o contained %o",
      function (iterable1, iterable2, f, result) {
        const iter = intersectionBy(f, iterable1 as any, iterable2 as any);
        expect(toArray(iter)).toEqual(result);
      },
    );
  });

  describe("async", function () {
    it.each([
      [
        toAsync([{ x: 1 }, { x: 4 }]),
        toAsync([{ x: 1 }, { x: 2 }, { x: 3 }]),
        (a: any) => a.x,
        [{ x: 1 }],
      ],

      [
        [{ x: 1 }, { x: 4 }],
        toAsync([{ x: 1 }, { x: 2 }, { x: 3 }]),
        (a: any) => a.x,
        [{ x: 1 }],
      ],
      [
        toAsync([{ x: 1 }, { x: 4 }]),
        [{ x: 1 }, { x: 2 }, { x: 3 }],
        (a: any) => a.x,
        [{ x: 1 }],
      ],
      ["abcd", "cdefgc", (a: any) => a, ["c", "d"]],
    ])(
      "should return all elements in iterable1 contained iterable2",
      async function (iterable1, iterable2, f, result) {
        const iter = intersectionBy(
          f,
          iterable1 as AsyncIterable<any>,
          iterable2 as AsyncIterable<any>,
        );
        expect(await toArray(iter)).toEqual(result);
      },
    );

    it("should be passed concurrent object when job works concurrently", async function () {
      const mock1 = generatorMock();
      const mock2 = generatorMock();
      const iter = intersectionBy((a) => a, mock1, mock2);
      const concurrent = Concurrent.of(2) as any;

      await iter.next(concurrent);
      // mock2 only concurrent
      expect((mock2 as any).getConcurrent()).toEqual(concurrent);
    });
  });
});
