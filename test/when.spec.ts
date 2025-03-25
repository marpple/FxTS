import { isNumber, isString, pipe, when } from "../src";

describe("when", function () {
  const test = <T>(value: T) =>
    pipe(
      value,
      when(
        (value) => value === 100,
        (value) => {
          expect(value).toBeTruthy();
        },
      ),
      when(isString, () => "Hello fxts"),
    );

  it("If the input value is a number, it will be filtered out by the first 'when' function. And throw undefined.", () => {
    const INPUT_VALUE = 100;

    test(INPUT_VALUE);
  });
  it("If the input value is a string, it will be filtered out by the second 'when' function. And return value is 'Hello fxts'", () => {
    const INPUT_VALUE = "Hello World";

    expect(test(INPUT_VALUE)).toBe("Hello fxts");
  });
  it("If nothing matches, all 'when' functions will be passed.", () => {
    const INPUT_VALUE = [1, 2, 3, 4];

    expect(test(INPUT_VALUE)).toEqual(INPUT_VALUE);
  });
});
