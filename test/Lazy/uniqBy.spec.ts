import { filter, map, pipe, toArray, toAsync, uniqBy } from "../../src/index";
import { Concurrent } from "../../src/Lazy/concurrent";
import { generatorMock } from "../utils";

describe("uniqBy", function () {
  describe("sync", function () {
    it("should be removed duplicate values by the callback", function () {
      const res1 = uniqBy((a) => a, "marpple");
      expect([...res1]).toEqual(["m", "a", "r", "p", "l", "e"]);

      const res2 = uniqBy(
        (a) => a.age,
        [
          {
            age: 21,
          },
          {
            age: 22,
          },
          {
            age: 21,
          },
          {
            age: 23,
          },
          {
            age: 22,
          },
        ],
      );
      expect([...res2]).toEqual([
        {
          age: 21,
        },
        {
          age: 22,
        },
        {
          age: 23,
        },
      ]);

      const res3 = uniqBy((a) => a, [1, 2, 3, 4]);
      expect([...res3]).toEqual([1, 2, 3, 4]);
    });

    it("should be able to be used as a curried function in the pipeline", function () {
      const res = pipe(
        [1, 2, 3, 4, 4, 2],
        map((a) => a + 10),
        filter((a) => a % 2 === 0),
        uniqBy((a) => a),
        toArray,
      );

      expect(res).toEqual([12, 14]);
    });
  });

  describe("async", function () {
    it("should be removed duplicate values by the callback", async function () {
      const res1 = await toArray(uniqBy((a) => a, toAsync("marpple")));
      expect(res1).toEqual(["m", "a", "r", "p", "l", "e"]);

      const res2 = await toArray(
        uniqBy(
          (a) => a.age,
          toAsync([
            {
              age: 21,
            },
            {
              age: 22,
            },
            {
              age: 21,
            },
            {
              age: 23,
            },
            {
              age: 22,
            },
          ]),
        ),
      );
      expect(res2).toEqual([
        {
          age: 21,
        },
        {
          age: 22,
        },
        {
          age: 23,
        },
      ]);

      const res3 = await toArray(uniqBy((a) => a, toAsync([1, 2, 3, 4])));
      expect(res3).toEqual([1, 2, 3, 4]);
    });

    it("should be able to be used as a curried function in the pipeline", async function () {
      const res = await pipe(
        toAsync([1, 2, 3, 4, 4, 2]),
        map((a) => a + 10),
        filter((a) => a % 2 === 0),
        uniqBy((a) => a),
        toArray,
      );

      expect(res).toEqual([12, 14]);
    });

    it("should be passed concurrent object when job works concurrently", async function () {
      const mock = generatorMock();
      const iter = uniqBy((a) => a, mock);
      const concurrent = Concurrent.of(2) as any;

      await iter.next(concurrent);
      expect((mock as any).getConcurrent()).toEqual(concurrent);
    });
  });
});
