import { isNumber, pipe, unless } from "../src";

describe("unless", () => {
  it("do process function if predicate return false", () => {
    let count = 0;
    const result = pipe(
      "0",

      unless(isNumber, (input) => {
        count += 1;
        return Number(input);
      }),
    );
    expect(result).toBe(0);
    expect(count).toBe(1);
  });

  it("skip process function if predicate return true", () => {
    let count = 0;
    const result = pipe(
      0,

      unless(isNumber, (input) => {
        count += 1;
        return Number(input);
      }),
    );
    expect(result).toBe(0);
    expect(count).toBe(0);
  });
});
