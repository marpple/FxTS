import { pipe, split, toAsync, map, toArray, filter } from "../../src";

describe("split", function () {
  describe("sync", function () {
    it("should return an empty array", function () {
      const iter = split("", "");
      expect([...iter]).toEqual([]);
    });

    it("should be splited by empty string", function () {
      const iter = split("", "abcdefg");
      expect([...iter]).toEqual(["a", "b", "c", "d", "e", "f", "g"]);
    });

    it("should be splited by separator", function () {
      const iter = split(",", "a,b,c,d,e,f,g");
      expect([...iter]).toEqual(["a", "b", "c", "d", "e", "f", "g"]);
    });

    it("should be splited by separator(unicode)", function () {
      const iter = split(",", "👍,😀,🙇‍♂️,🤩,🎉");
      expect([...iter]).toEqual(["👍", "😀", "🙇‍♂️", "🤩", "🎉"]);
    });

    it("should be able to be used as a curried function in the pipeline", function () {
      const res = pipe(
        "1,2,3,4,5,6,7,8,9,10",
        split(","),
        map((a) => Number(a)),
        filter((a) => a % 2 === 0),
        toArray,
      );

      expect(res).toEqual([2, 4, 6, 8, 10]);
    });
  });

  describe("async", function () {
    it("should return an empty array", async function () {
      const acc = [];
      for await (const a of split("", toAsync(""))) {
        acc.push(a);
      }
      expect(acc).toEqual([]);
    });

    it("should be splited by empty string", async function () {
      const acc = [];
      for await (const a of split("", "abcdefg")) {
        acc.push(a);
      }
      expect(acc).toEqual(["a", "b", "c", "d", "e", "f", "g"]);
    });

    it("should be splited by separator", async function () {
      const acc = [];
      for await (const a of split(",", "a,b,c,d,e,f,g")) {
        acc.push(a);
      }
      expect(acc).toEqual(["a", "b", "c", "d", "e", "f", "g"]);
    });

    it("should be splited by separator(unicode)", async function () {
      const acc = [];
      for await (const a of split(",", "👍,😀,🙇‍♂️,🤩,🎉")) {
        acc.push(a);
      }
      expect(acc).toEqual(["👍", "😀", "🙇‍♂️", "🤩", "🎉"]);
    });

    it("should be able to be used as a curried function in the pipeline", async function () {
      const res = await pipe(
        toAsync("1,2,3,4,5,6,7,8,9,10"),
        split(","),
        map((a) => Number(a)),
        filter((a) => a % 2 === 0),
        toArray,
      );

      expect(res).toEqual([2, 4, 6, 8, 10]);
    });
  });
});
