import { range, reduce } from "../src/index";

const addNumber = (a: number, b: number) => a + b;

describe("reduce", () => {
  describe("sync", () => {
    it("should return initial value when the given `iterable` is empty array", () => {
      expect(reduce((a, b) => a + b, "seed", [])).toEqual("seed");
    });

    it("should return 'undefined' when the given `iterable` is an empty array and initial value is absent", () => {
      expect(reduce((a, b) => a + b, [])).toBeUndefined();
    });

    it("should work given it is initial value", () => {
      expect(reduce(addNumber, 10, range(1, 6))).toEqual(25);
    });

    it("should use the first value as the initial value if initial value is absent", () => {
      expect(reduce(addNumber, range(1, 6))).toEqual(15);
    });
  });
});
