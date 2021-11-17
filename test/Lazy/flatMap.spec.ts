import { flatMap, map, pipe, toArray, toAsync } from "../../src/index";

describe("flatMap", function () {
  describe("sync", function () {
    it("should be flat-mapped", function () {
      const acc = [];
      for (const a of flatMap(
        (s) => s.split(" "),
        ["It is", "a good", "day"],
      )) {
        acc.push(a);
      }
      expect(acc).toEqual(["It", "is", "a", "good", "day"]);
    });

    it("should be able to be used as a curried function in the pipeline", function () {
      const res = pipe(
        ["It is", "a good", "day"],
        flatMap((s) => s.split(" ")),
        map((a) => a.toUpperCase()),
        toArray,
      );

      expect(res).toEqual(["IT", "IS", "A", "GOOD", "DAY"]);
    });
  });

  describe("async", function () {
    it("should be flat-mapped", async function () {
      const acc = [];
      // prettier-ignore
      for await (const a of flatMap((s) => s.split(" "), toAsync(["It is", "a good", "day"]))) {
      acc.push(a);
    }
      expect(acc).toEqual(["It", "is", "a", "good", "day"]);
    });

    it("should be able to be used as a curried function in the pipeline", async function () {
      const res = await pipe(
        toAsync(["It is", "a good", "day"]),
        flatMap((s) => s.split(" ")),
        map((a) => a.toUpperCase()),
        toArray,
      );

      expect(res).toEqual(["IT", "IS", "A", "GOOD", "DAY"]);
    });
  });
});
