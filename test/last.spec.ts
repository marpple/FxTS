import { filter, last, map, pipe, range, toAsync } from "../src";

describe("last", function () {
  describe("sync", function () {
    it("should return last item of the given 'Iterable'", function () {
      const result = last(range(5));
      expect(result).toEqual(4);
    });

    it("should return last item of the given 'Iterable' - array", function () {
      const result = last([1, 2, 3, 4]);
      expect(result).toEqual(4);
    });

    it("should return last item of the given 'Iterable' - string", function () {
      const result = last("marpple");
      expect(result).toEqual("e");
    });

    it("should be able to be used as a curried function in the pipeline", function () {
      const result = pipe(
        [1, 2, 3, 4],
        map((a) => a + 10),
        filter((a) => a % 2 === 0),
        last,
      );
      expect(result).toEqual(14);
    });
  });

  describe("async", function () {
    it("should return last item of the given 'AsyncIterable'", async function () {
      const result = await last(toAsync(range(5)));
      expect(result).toEqual(4);
    });

    it("should be able to be used as a curried function in the pipeline", async function () {
      const result = await pipe(
        toAsync([1, 2, 3, 4]),
        map((a) => a + 10),
        filter((a) => a % 2 === 0),
        last,
      );
      expect(result).toEqual(14);
    });
  });
});
