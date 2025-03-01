import { isNumber, pipe, sum, when } from "../src";

describe("when", function () {
  const INPUT_NUMBER_VALUE = 10;
  const INPUT_ARRAY_VALUE = [1, 2, 3];

  const inputNumberTest = when<string | number>(isNumber, (value) => {
    expect(value).toBe(INPUT_NUMBER_VALUE);
  });
  const inputArrayTest = when<number[]>(
    (list) => sum(list) >= 10,
    (list) => {
      expect(list).toEqual(expect.arrayContaining(INPUT_ARRAY_VALUE));
    },
  );

  it("If return of predicate is true, return is undefined.", () => {
    expect(inputNumberTest(INPUT_NUMBER_VALUE)).toBeUndefined();
    expect(inputArrayTest([...INPUT_ARRAY_VALUE, 4])).toBeUndefined();
  });
  it("If return of predicate is false, return is same input.", () => {
    expect(inputNumberTest("Hello World")).toBe("Hello World");
    expect(inputArrayTest(INPUT_ARRAY_VALUE)).toBe(INPUT_ARRAY_VALUE);
  });
  it("Repeating the above test using pipe", () => {
    expect(pipe(INPUT_NUMBER_VALUE, inputNumberTest)).toBeUndefined();
    expect(pipe("Hello World", inputNumberTest)).toBe("Hello World");
    expect(pipe([...INPUT_ARRAY_VALUE, 4], inputArrayTest)).toBeUndefined();
    expect(pipe(INPUT_ARRAY_VALUE, inputArrayTest)).toBe(INPUT_ARRAY_VALUE);
  });

  // it("Repeating the above test using pipe, toAsync", async () => {
  // await pipe(
  //   Promise.resolve([1, 2, 3, 4]),
  //   toAsync,
  //   when(
  //     (list) => sum(list) >= 10,
  //     (list) => {
  //       expect(list).toEqual(expect.arrayContaining(INPUT_ARRAY_VALUE));
  //     },
  //   ),
  // );
  // });
});
