import { split, toAsync } from "../../src";

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
  });
});
