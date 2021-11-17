import { pipe, range, reduce, toAsync } from "../src/index";

const addNumber = (a: number, b: number) => a + b;
const addNumberAsync = async (a: number, b: number) => a + b;

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

  describe("async", () => {
    it("should reduce `iterable` by the callback", async () => {
      expect(await reduce(addNumber, 10, toAsync(range(1, 6)))).toEqual(25);
    });

    it("should use the first value as the initial value if initial value is absent", async () => {
      expect(await reduce(addNumber, toAsync(range(1, 6)))).toEqual(15);
    });

    it("should reduce `AsyncIterable` by the callback with initial value", async () => {
      expect(await reduce(addNumberAsync, 10, toAsync(range(1, 6)))).toEqual(
        25,
      );
    });

    it("should reduce 'AsyncIterable' by the callback", async () => {
      expect(await reduce(addNumberAsync, toAsync(range(1, 6)))).toEqual(15);
    });

    it("should return rejected 'Promise' if an error occurs in the callback", async () => {
      await expect(
        reduce(
          () => {
            throw new Error("err");
          },
          0,
          toAsync(range(1, 6)),
        ),
      ).rejects.toThrow("err");

      await expect(
        reduce(() => {
          throw new Error("err");
        }, toAsync(range(1, 6))),
      ).rejects.toThrow("err");

      await expect(
        pipe(
          toAsync(range(1, 6)),
          reduce(() => {
            throw new Error("err");
          }),
        ),
      ).rejects.toThrow("err");
    });

    it("should return rejected 'Promise' if an error occurs in the callback", async () => {
      await expect(
        reduce(() => Promise.reject(new Error("err")), 0, toAsync(range(1, 6))),
      ).rejects.toThrow("err");

      await expect(
        reduce(() => Promise.reject(new Error("err")), toAsync(range(1, 6))),
      ).rejects.toThrow("err");

      await expect(
        pipe(
          toAsync(range(1, 6)),
          reduce(() => Promise.reject(new Error("err"))),
        ),
      ).rejects.toThrow("err");
    });
  });
});
