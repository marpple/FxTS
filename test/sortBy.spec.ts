import { filter, identity, pipe, sortBy, toAsync } from "../src";

describe("sortBy", function () {
  describe("sync", function () {
    it.each([
      [identity, [], []],
      [identity, [3, 4, 1, 2, 5, 2], [1, 2, 2, 3, 4, 5]],
      [identity, "bcdae", ["a", "b", "c", "d", "e"]],
      [
        (a: any) => a.id,
        [
          { id: 4, name: "foo" },
          { id: 2, name: "bar" },
          { id: 3, name: "lee" },
        ],
        [
          { id: 2, name: "bar" },
          { id: 3, name: "lee" },
          { id: 4, name: "foo" },
        ],
      ],
    ])("should sort to elements by 'f'", function (f, iterable, result) {
      expect(sortBy(f, iterable as Iterable<any>)).toEqual(result);
    });

    it("should be able to be used as a curried function in the pipeline", function () {
      const res = pipe(
        [3, 4, 1, 2, 5, 2],
        filter((a) => a % 2 !== 0),
        sortBy(identity),
      );
      expect(res).toEqual([1, 3, 5]);
    });
  });

  describe("async", function () {
    it.each([
      [identity, [], []],
      [identity, [3, 4, 1, 2, 5, 2], [1, 2, 2, 3, 4, 5]],
      [identity, "bcdae", ["a", "b", "c", "d", "e"]],
      [
        (a: any) => a.id,
        [
          { id: 4, name: "foo" },
          { id: 2, name: "bar" },
          { id: 3, name: "lee" },
        ],
        [
          { id: 2, name: "bar" },
          { id: 3, name: "lee" },
          { id: 4, name: "foo" },
        ],
      ],
    ])("should sort to elements by 'f'", async function (f, iterable, result) {
      const res = await sortBy(f, toAsync(iterable as Iterable<any>));
      expect(res).toEqual(result);
    });

    it("should be able to be used as a curried function in the pipeline", async function () {
      const res = await pipe(
        [3, 4, 1, 2, 5, 2],
        toAsync,
        filter((a) => a % 2 !== 0),
        sortBy(identity),
      );
      expect(res).toEqual([1, 3, 5]);
    });
  });
});
