import { pickBy, pipe } from "../src";

describe("pickBy", function () {
  describe("sync", function () {
    const obj = { a: 1, b: "2", c: true };

    it.each([
      [
        ([key, value]: [string, any]) =>
          key === "b" || typeof value === "boolean",
        obj,
      ],
      [
        ([key, value]: [string, any]) =>
          key === "b" ||
          typeof value === "boolean" ||
          (typeof value === "symbol" ? Promise.resolve(true) : false),
        obj,
      ],
    ])("should be picked properties by given predicate function", (f, obj) => {
      expect(pickBy(f, obj)).toEqual({ b: "2", c: true });
    });

    it("should be able to be used as a curried function in the pipeline", function () {
      const res = pipe(
        { a: 1, b: "2", c: true },
        pickBy(([key, value]) => key === "b" || typeof value === "boolean"),
      );
      expect(res).toEqual({ b: "2", c: true });
    });
  });

  describe("async", function () {
    const obj = { a: 1, b: "2", c: true };
    it.each([
      [
        async ([key, value]: [string, any]) =>
          key === "b" || typeof value === "boolean",
        obj,
      ],
      [
        ([key, value]: [string, any]) =>
          key === "b" || Promise.resolve(typeof value === "boolean"),
        obj,
      ],
    ])(
      "should be picked properties by given predicate function",
      async (f, obj) => {
        expect(await pickBy(f, obj)).toEqual({ b: "2", c: true });
      },
    );
    it("should be able to be used as a curried function in the pipeline", async function () {
      const res = await pipe(
        obj,
        pickBy(
          async ([key, value]) => key === "b" || typeof value === "boolean",
        ),
      );
      expect(res).toEqual({ b: "2", c: true });
    });
  });
});
