import { isArray, isEmpty, isNil, isUndefined, negate } from "../src";

describe("negate", function () {
  describe("negate isUndefined", () => {
    const isDefined = negate(isUndefined);
    it.each([2, true, null, {}, [], Symbol("a"), "a"])(
      "given undefined then should be true",
      function (a) {
        const result = isDefined(a);
        expect(result).toEqual(true);
      },
    );

    it("given undefined then should be false", function () {
      const result = isDefined(undefined);
      expect(result).toEqual(false);
    });
  });

  describe("negate isArray", () => {
    const isNotArray = negate(isArray);
    it.each([undefined, null, true, 1, "a", Symbol("a"), () => null])(
      "given non array then should return true",
      function (s) {
        const result = isNotArray(s);
        expect(result).toEqual(true);
      },
    );

    it("given array then should return false", function () {
      const result = isNotArray([1, 2, 3]);
      expect(result).toEqual(false);
    });
  });

  describe("negate isEmpty", () => {
    const isNotEmpty = negate(isEmpty);

    const testParameters = [
      [1, false],
      [0, false],
      [false, false],
      [true, false],
      [new Date(), false],
      [undefined, true],
      [null, true],
      [{}, true],
      [{ a: 1 }, false],
      [[], true],
      [[1], false],
      ["", true],
      ["a", false],
      [Symbol(""), false],
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      [function () {}, false],
    ] as [any, any][];

    it.each(testParameters)(
      "should Return `true` if the given value is empty value(%s)",
      (input, expected) => expect(isNotEmpty(input)).toEqual(!expected),
    );
  });

  describe("negate isNil", () => {
    const isNotNil = negate(isNil);
    it("given null or undefined then should return false", function () {
      const res1 = isNotNil(null);
      expect(res1).toEqual(false);

      const res2 = isNotNil(undefined);
      expect(res2).toEqual(false);
    });
    it.each([3, "3", {}, Symbol("3"), false])(
      "given not (null or undefined) then should return true",
      (value) => expect(isNotNil(value)).toStrictEqual(true),
    );
  });
});
