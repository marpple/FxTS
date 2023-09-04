import { filter, join, map, pipe, toAsync } from "../src";
import { asyncEmpty, empty } from "../src/_internal/utils";

describe("join", function () {
  describe("sync", function () {
    it("should return an empty string if there are no iterable items", function () {
      expect(join(", ", "")).toEqual("");
      expect(join(", ", [])).toEqual("");
      expect(join(", ", empty())).toEqual("");
    });

    it("should be joined with separator", function () {
      expect(join("_", [1])).toEqual("1");
      expect(join(", ", "hello")).toEqual("h, e, l, l, o");
    });

    it("should work given it is initial value", function () {
      expect(join("~", [1, 2, 3, 4, 5])).toEqual("1~2~3~4~5");
    });

    it("should be able to be used as a curried function in the pipeline", function () {
      const res = pipe(
        [1, 2, 3, 4, 5, 6, 7],
        map((a) => a + 10),
        filter((a) => a % 2 === 0),
        join("-"),
      );
      expect(res).toEqual("12-14-16");
    });

    it("should return an empty string when it is an empty array", function () {
      expect(join("~", [])).toEqual("");
    });
  });

  describe("async", function () {
    it("should return an empty string if there are no iterable items", async function () {
      expect(await join(", ", asyncEmpty())).toEqual("");
    });

    it("should be discarded elements by length", async function () {
      const res = await join("-", toAsync([1, 2, 3, 4, 5]));
      expect(res).toEqual("1-2-3-4-5");
    });

    it("should be able to be used as a curried function in the pipeline", async function () {
      const res = await pipe(
        toAsync([1, 2, 3, 4, 5, 6, 7]),
        map((a) => a + 10),
        filter((a) => a % 2 === 0),
        join("-"),
      );

      expect(res).toEqual("12-14-16");
    });

    it("should be able to handle an error when asynchronous", async function () {
      await expect(
        pipe(
          toAsync("marpple"),
          filter(() => {
            throw new Error("err");
          }),
          join("!"),
        ),
      ).rejects.toThrow("err");
    });
  });
});
