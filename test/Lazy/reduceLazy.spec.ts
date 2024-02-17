import { filter, map, pipe, range, reduceLazy, toAsync } from "../../src";

const addNumber = (a: number, b: number) => a + b;
const addNumberAsync = async (a: number, b: number) => a + b;

// these tests are almost identical to `reduce.spec.ts`
describe("reduceLazy", () => {
  describe("sync", () => {
    it("should return initial value when the given `iterable` is empty array", () => {
      const reduce = reduceLazy((a, b) => a + b, "seed");
      expect(reduce([])).toEqual("seed");
    });

    it("should be occured error when the given `iterable` is an empty array and initial value is absent", () => {
      const reduce = reduceLazy((a: number, b: number) => a + b);
      expect(() => reduce([])).toThrow();
    });

    it("should work given it is initial value", () => {
      const reduce = reduceLazy(addNumber, 10);
      expect(reduce(range(1, 6))).toEqual(25);
    });

    it("should use the first value as the initial value if initial value is absent", () => {
      const reduce = reduceLazy(addNumber);
      expect(reduce(range(1, 6))).toEqual(15);
    });

    it("should be able to be used as a curried function in the pipeline", () => {
      const res = pipe(
        ["1", "2", "3", "4", "5"],
        map((a) => Number(a)),
        filter((a) => a % 2),
        reduceLazy(addNumber),
      );
      expect(res).toEqual(1 + 3 + 5);
    });
  });

  describe("async", () => {
    it("should reduce `iterable` by the callback", async () => {
      const reduce = reduceLazy(addNumber, 10);
      expect(await reduce(toAsync(range(1, 6)))).toEqual(25);
    });

    it("should use the first value as the initial value if initial value is absent", async () => {
      const reduce = reduceLazy(addNumber);
      expect(await reduce(toAsync(range(1, 6)))).toEqual(15);
    });

    it("should reduce `AsyncIterable` by the callback with initial value", async () => {
      const reduce = reduceLazy(addNumberAsync, 10);
      expect(await reduce(toAsync(range(1, 6)))).toEqual(25);
    });

    it("should reduce 'AsyncIterable' by the callback", async () => {
      const reduce = reduceLazy(addNumberAsync);
      expect(await reduce(toAsync(range(1, 6)))).toEqual(15);
    });

    it("should be able to be used as a curried function in the pipeline", async () => {
      const res1 = await pipe(
        toAsync(["1", "2", "3", "4", "5"]),
        map((a) => Number(a)),
        filter((a) => a % 2),
        reduceLazy(addNumber),
      );
      // async callback
      const res2 = await pipe(
        toAsync(["1", "2", "3", "4", "5"]),
        map((a) => Number(a)),
        filter((a) => a % 2),
        reduceLazy(addNumberAsync),
      );
      expect(res1).toEqual(1 + 3 + 5);
      expect(res2).toEqual(1 + 3 + 5);
    });
  });
});
