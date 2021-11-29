import { split } from "../../src";

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
});
