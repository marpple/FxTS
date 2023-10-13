import { isEmpty } from "../src";

describe("isEmpty", function () {
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
    [new Map(), true],
    [new Map([["key", "value"]]), false],
    [new Set(), true],
    [new Set(["value"]), false],
    [Symbol(""), false],
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    [function () {}, false],
  ] as [any, any][];

  it.each(testParameters)(
    "should Return `true` if the given value is empty value(%s)",
    (input, expected) => expect(isEmpty(input)).toEqual(expected),
  );
});
