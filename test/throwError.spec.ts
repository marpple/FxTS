import { isNumber, pipe, throwError, unless } from "../src";

describe("throwError", () => {
  it("throw in pipe", () => {
    try {
      pipe(
        "0",

        unless(
          isNumber,
          throwError((input) => Error(`input is ${input}`)),
        ),
      );
    } catch (error: any) {
      expect(error.message).toBe("input is 0");
    }
  });

  it("throw error", () => {
    try {
      throwError((input) => Error(`input is ${input}`))(0);
    } catch (error: any) {
      expect(error.message).toBe("input is 0");
    }
  });
});
