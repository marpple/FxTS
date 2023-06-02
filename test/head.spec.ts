import { filter, head, map, pipe, toAsync } from "../src";
import { range } from "../src/Lazy";

describe("head", function () {
  describe("sync", function () {
    it("should return first item of the given 'Iterable'", function () {
      const result = head(range(5));
      expect(result).toEqual(0);
    });

    it("should return first item of the given 'Iterable' - array", function () {
      const res = head([1, 2, 3, 4]);
      expect(res).toEqual(1);
    });

    it("should return first item of the given 'Iterable' - string", function () {
      const result = head("marpple");
      expect(result).toEqual("m");
    });

    it("should be able to be used as a curried function in the pipeline", function () {
      const res1 = pipe(
        [1, 2, 3, 4],
        map((a) => a + 10),
        filter((a) => a % 2 === 0),
        head,
      );
      expect(res1).toEqual(12);
    });
  });

  describe("async", function () {
    it("should return first item of the given 'AsyncIterable'", async function () {
      const res = await head(toAsync([1, 2, 3, 4]));
      expect(res).toEqual(1);
    });
    it("should be able to be used as a curried function in the pipeline", async function () {
      const res = await pipe(
        toAsync([1, 2, 3, 4]),
        map((a) => a + 10),
        filter((a) => a % 2 === 0),
        head,
      );
      expect(res).toEqual(12);
    });
  });
});
