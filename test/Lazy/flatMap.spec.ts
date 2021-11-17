import { flatMap, map, pipe, toArray, toAsync } from "../../src/index";

describe("flatMap", () => {
  describe("sync", () => {
    it("should be flat-mapped", () => {
      const acc = [];
      for (const a of flatMap(
        (s) => s.split(" "),
        ["It is", "a good", "day"],
      )) {
        acc.push(a);
      }
      expect(acc).toEqual(["It", "is", "a", "good", "day"]);
    });

    it("should be able to be used as a curried function in the pipeline", () => {
      const res = pipe(
        ["It is", "a good", "day"],
        flatMap((s) => s.split(" ")),
        map((a) => a.toUpperCase()),
        toArray,
      );

      expect(res).toEqual(["IT", "IS", "A", "GOOD", "DAY"]);
    });
  });

  describe("async", () => {
    it("should be flat-mapped", async () => {
      const acc = [];
      // prettier-ignore
      for await (const a of flatMap((s) => s.split(" "), toAsync(["It is", "a good", "day"]))) {
      acc.push(a);
    }
      expect(acc).toEqual(["It", "is", "a", "good", "day"]);
    });

    it("should be able to be used as a curried function in the pipeline", async () => {
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
