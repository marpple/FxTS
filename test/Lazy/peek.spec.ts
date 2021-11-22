import { map, peek, pipe, toArray, toAsync } from "../../src/index";
import { Concurrent } from "../../src/Lazy/concurrent";
import { generatorMock } from "../utils";

describe("peek", function () {
  describe("sync", function () {
    it("should be called the provided callback", function () {
      let sum = 0;
      const res = peek((a) => (sum = sum + a), [1, 2, 3, 4]);

      // eslint-disable-next-line
      for (const _ of res) {
      }
      expect(sum).toEqual(10);
    });

    it("should be able to be used as a curried function in the pipeline", function () {
      let sum = 0;
      const res = pipe(
        [1, 2, 3, 4],
        map((a) => a + 10),
        peek((a) => (sum = sum + a)),
        map((a) => a + 10),
        (a) => toArray(a),
      );
      expect(sum).toEqual(50);
      expect(res).toEqual([21, 22, 23, 24]);
    });

    it("should be able to handle an error", function () {
      const res: number[] = [];
      expect(() =>
        pipe(
          [1, 2, 3, 4],
          map((a) => a + 10),
          peek((a) => {
            if (a === 13) {
              throw new Error("err");
            }
            res.push(a);
          }),
          map((a) => a + 10),
          (a) => toArray(a),
        ),
      ).toThrow("err");
      expect(res).toEqual([11, 12]);
    });
  });
  describe("async", function () {
    it("should be called the provided callback", async function () {
      let sum = 0;
      const res = peek((a) => (sum = sum + a), toAsync([1, 2, 3, 4]));

      // eslint-disable-next-line
      for await (const _ of res) {
      }
      expect(sum).toEqual(10);
    });

    it("should be able to be used as a curried function in the pipeline", async function () {
      let sum = 0;
      const res = await pipe(
        toAsync([1, 2, 3, 4]),
        map((a) => a + 10),
        peek((a) => (sum = sum + a)),
        map((a) => a + 10),
        (a) => toArray(a),
      );
      expect(sum).toEqual(50);
      expect(res).toEqual([21, 22, 23, 24]);
    });

    it("should be able to handle an error", async function () {
      const res: number[] = [];

      await expect(
        pipe(
          toAsync([1, 2, 3, 4]),
          map((a) => a + 10),
          peek((a) => {
            if (a === 13) {
              throw new Error("err");
            }
            res.push(a);
          }),
          map((a) => a + 10),
          (a) => toArray(a),
        ),
      ).rejects.toThrow("err");

      expect(res).toEqual([11, 12]);
    });

    it("should be passed concurrent object when job works concurrently", async function () {
      const mock = generatorMock();
      const iter = peek((a) => a, mock);
      const concurrent = Concurrent.of(2) as any;

      await iter.next(concurrent);
      expect((mock as any).getConcurrent()).toEqual(concurrent);
    });
  });
});
