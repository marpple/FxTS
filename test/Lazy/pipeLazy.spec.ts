import {
  delay,
  each,
  filter,
  map,
  pipeLazy,
  range,
  reduce,
  toArray,
  toAsync,
} from "../../src";

describe("pipeLazy", function () {
  describe("sync", function () {
    it("should return the value evaluated by the composed function", function () {
      const res = pipeLazy(
        (n: number) => String(n + 1),
        (n) => Number(n) + 1,
        (n) => String(n + 1),
      )(0);
      expect(res).toEqual("3");
    });

    it("should work when the composed function deals with 'Iterable'", function () {
      const res = pipeLazy(
        (n: number[]) => map((a) => a + 5, n),
        (n) => filter((a) => a % 2 === 0, n),
        (n) => reduce((a, b) => a + b, 0, n),
      )([1, 2, 3, 4, 5]);
      expect(res).toEqual(24);
    });
  });

  describe("async", function () {
    it("should work when the composed function deals with 'AsyncIterable'", async function () {
      const res1 = await pipeLazy(
        (n: AsyncIterableIterator<number>) => map((a) => a + 5, n),
        (n) => filter((a) => a % 2 === 0, n),
        (n) => reduce((a, b) => a + b, 0, n),
      )(toAsync([1, 2, 3, 4, 5]));

      expect(res1).toEqual(24);

      const res2 = await pipeLazy(
        (n: AsyncIterableIterator<number>) => map((a) => a + 5, n),
        (n) => filter((a) => a % 2 === 0, n),
        (n) => toArray(n),
        (n) => reduce((a, b) => a + b, 0, n),
      )(toAsync([1, 2, 3, 4, 5]));

      expect(res2).toEqual(24);
    });

    it("should return rejected 'Promise' if an error occurs in the callback", async function () {
      await expect(
        pipeLazy(
          (a: AsyncIterableIterator<number>) =>
            map(() => {
              throw new Error("err");
            }, a),
          (a) => reduce((acc: number, a) => acc + a, a),
        )(toAsync(range(1, 10))),
      ).rejects.toThrow("err");

      // Promise reject
      await expect(
        pipeLazy(
          (a: AsyncIterableIterator<number>) =>
            map(() => Promise.reject(new Error("err")), a),
          (a) => reduce((acc: number, a) => acc + a, a),
        )(toAsync(range(1, 10))),
      ).rejects.toThrow("err");
    });

    it("should be able to use thenable object", async function () {
      let res = 0;

      await pipeLazy(
        (arr: string[]) => arr,
        toAsync,
        each(() => {
          return {
            then: (resolve: any) => {
              resolve(delay(0).then(() => res++));
            },
            catch: (reject: any) => reject(),
          };
        }),
      )(["a", "b", "c"]);

      expect(res).toBe(3);
    });
  });
});
