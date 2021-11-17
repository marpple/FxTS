import { compact, filter, map, pipe, toArray, toAsync } from "../../src/index";

describe("compact", () => {
  describe("sync", () => {
    it(`should be excluded 'null' 'undefined' - number`, () => {
      const acc = [];
      for (const a of compact([0, 1, undefined, 3, null, 5])) {
        acc.push(a);
      }
      expect(acc).toEqual([0, 1, 3, 5]);
    });

    it("should be excluded 'null' 'undefined' - string", () => {
      const acc = [];
      for (const a of compact(["", "a", undefined, "b", null])) {
        acc.push(a);
      }
      expect(acc).toEqual(["", "a", "b"]);
    });

    it("should be able to be used as a curried function in the pipeline", () => {
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

  describe("async", () => {
    it("should be excluded 'null' 'undefined' - number", async () => {
      const acc = [];
      for await (const a of compact(toAsync([0, 1, undefined, 3, null, 5]))) {
        acc.push(a);
      }
      expect(acc).toEqual([0, 1, 3, 5]);
    });

    it("should be excluded 'null' 'undefined' - string", async () => {
      const acc = [];
      for await (const a of compact(toAsync(["", "a", undefined, "b", null]))) {
        acc.push(a);
      }
      expect(acc).toEqual(["", "a", "b"]);
    });

    it("should be able to be used as a curried function in the pipeline", async () => {
      const res = await pipe(
        toAsync([1, undefined, 3, 4, 5, null, 7, 8]),
        compact,
        map((a) => a + 10),
        filter((a) => a % 2 === 0),
        toArray,
      );

      expect(res).toEqual([14, 18]);
    });
  });
});
