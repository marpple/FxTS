import { fork, map, pipe, toAsync } from "../../src/index";

describe("fork", function () {
  describe("sync", function () {
    it("should be forked iterable(number)", function () {
      const arr = [1, 2, 3];

      const iter1 = fork(arr);
      const iter2 = fork(arr);

      expect(iter1.next()).toEqual({ value: 1, done: false });
      expect(iter1.next()).toEqual({ value: 2, done: false });
      expect(iter1.next()).toEqual({ value: 3, done: false });
      expect(iter1.next()).toEqual({ value: undefined, done: true });

      expect(iter2.next()).toEqual({ value: 1, done: false });
      expect(iter2.next()).toEqual({ value: 2, done: false });
      expect(iter2.next()).toEqual({ value: 3, done: false });
      expect(iter2.next()).toEqual({ value: undefined, done: true });
    });

    it("should be forked iterable(string)", function () {
      const arr = "abc";

      const iter1 = fork(arr);
      const iter2 = fork(arr);

      expect(iter1.next()).toEqual({ value: "a", done: false });
      expect(iter1.next()).toEqual({ value: "b", done: false });
      expect(iter1.next()).toEqual({ value: "c", done: false });
      expect(iter1.next()).toEqual({ value: undefined, done: true });

      expect(iter2.next()).toEqual({ value: "a", done: false });
      expect(iter2.next()).toEqual({ value: "b", done: false });
      expect(iter2.next()).toEqual({ value: "c", done: false });
      expect(iter2.next()).toEqual({ value: undefined, done: true });
    });

    it("should be able to be used as a forked function in the pipeline", function () {
      const arr = pipe(
        [1, 2, 3],
        map((a) => a + 10),
      );

      const iter1 = fork(arr);
      const iter2 = fork(arr);
      const iter3 = pipe(
        fork(iter1),
        map((a) => String(a)),
      );

      expect(arr.next()).toEqual({ value: 11, done: false });
      expect(arr.next()).toEqual({ value: 12, done: false });
      expect(arr.next()).toEqual({ value: 13, done: false });
      expect(arr.next()).toEqual({ value: undefined, done: true });

      expect(iter1.next()).toEqual({ value: 11, done: false });
      expect(iter2.next()).toEqual({ value: 11, done: false });
      expect(iter3.next()).toEqual({ value: "11", done: false });

      expect(iter1.next()).toEqual({ value: 12, done: false });
      expect(iter1.next()).toEqual({ value: 13, done: false });
      expect(iter1.next()).toEqual({ value: undefined, done: true });

      expect(iter2.next()).toEqual({ value: 12, done: false });
      expect(iter2.next()).toEqual({ value: 13, done: false });
      expect(iter2.next()).toEqual({ value: undefined, done: true });
    });

    it("forked iterator proceeds independently even if there is no data to process from the original.", function () {
      const arr = pipe(
        [1, 2, 3],
        map((a) => a + 10),
      );

      const iter1 = fork(arr);
      expect(arr.next()).toEqual({ value: 11, done: false });
      expect(arr.next()).toEqual({ value: 12, done: false });
      expect(arr.next()).toEqual({ value: 13, done: false });
      expect(arr.next()).toEqual({ value: undefined, done: true });

      expect(iter1.next()).toEqual({ value: 11, done: false });
      expect(iter1.next()).toEqual({ value: 12, done: false });
      expect(iter1.next()).toEqual({ value: 13, done: false });
      expect(iter1.next()).toEqual({ value: undefined, done: true });
    });

    it("should be forked in the middle of iterable progress", function () {
      const arr = pipe(
        [1, 2, 3],
        map((a) => a + 10),
      );

      const iter1 = fork(arr);
      const iter2 = fork(iter1);

      expect(arr.next()).toEqual({ value: 11, done: false });
      expect(iter1.next()).toEqual({ value: 11, done: false });
      expect(iter2.next()).toEqual({ value: 11, done: false });

      const iter3 = fork(arr);
      const iter4 = fork(iter1);
      expect(arr.next()).toEqual({ value: 12, done: false });
      expect(iter1.next()).toEqual({ value: 12, done: false });
      expect(iter1.next()).toEqual({ value: 13, done: false });
      expect(iter1.next()).toEqual({ value: undefined, done: true });
      expect(iter2.next()).toEqual({ value: 12, done: false });
      expect(iter3.next()).toEqual({ value: 12, done: false });
      expect(iter4.next()).toEqual({ value: 12, done: false });
    });
  });

  describe("async", function () {
    it("should be forked iterable(number)", async function () {
      const arr = toAsync([1, 2, 3]);

      const iter1 = fork(arr);
      const iter2 = fork(arr);

      expect(await arr.next()).toEqual({ value: 1, done: false });
      expect(await iter1.next()).toEqual({ value: 1, done: false });
      expect(await iter1.next()).toEqual({ value: 2, done: false });
      expect(await iter1.next()).toEqual({ value: 3, done: false });
      expect(await iter1.next()).toEqual({ value: undefined, done: true });

      expect(await iter2.next()).toEqual({ value: 1, done: false });
      expect(await iter2.next()).toEqual({ value: 2, done: false });
      expect(await iter2.next()).toEqual({ value: 3, done: false });
      expect(await iter2.next()).toEqual({ value: undefined, done: true });
    });

    it("should be forked iterable(string)", async function () {
      const arr = toAsync("abc");

      const iter1 = fork(arr);
      const iter2 = fork(arr);

      expect(await iter1.next()).toEqual({ value: "a", done: false });
      expect(await iter1.next()).toEqual({ value: "b", done: false });
      expect(await iter1.next()).toEqual({ value: "c", done: false });
      expect(await iter1.next()).toEqual({ value: undefined, done: true });

      expect(await iter2.next()).toEqual({ value: "a", done: false });
      expect(await iter2.next()).toEqual({ value: "b", done: false });
      expect(await iter2.next()).toEqual({ value: "c", done: false });
      expect(await iter2.next()).toEqual({ value: undefined, done: true });
    });

    it("should be able to be used as a forked function in the pipeline", async function () {
      const arr = pipe(
        toAsync([1, 2, 3]),
        map((a) => a + 10),
      );

      const iter1 = fork(arr);
      const iter2 = fork(arr);

      expect(await arr.next()).toEqual({ value: 11, done: false });
      expect(await arr.next()).toEqual({ value: 12, done: false });
      expect(await arr.next()).toEqual({ value: 13, done: false });
      expect(await arr.next()).toEqual({ value: undefined, done: true });

      expect(await iter1.next()).toEqual({ value: 11, done: false });
      expect(await iter2.next()).toEqual({ value: 11, done: false });

      expect(await iter1.next()).toEqual({ value: 12, done: false });
      expect(await iter1.next()).toEqual({ value: 13, done: false });
      expect(await iter1.next()).toEqual({ value: undefined, done: true });

      expect(await iter2.next()).toEqual({ value: 12, done: false });
      expect(await iter2.next()).toEqual({ value: 13, done: false });
      expect(await iter2.next()).toEqual({ value: undefined, done: true });
    });

    it("forked iterator proceeds independently even if there is no data to process from the original", async function () {
      const arr = pipe(
        toAsync([1, 2, 3]),
        map((a) => a + 10),
      );

      const iter1 = fork(arr);
      expect(await arr.next()).toEqual({ value: 11, done: false });
      expect(await arr.next()).toEqual({ value: 12, done: false });
      expect(await arr.next()).toEqual({ value: 13, done: false });
      expect(await arr.next()).toEqual({ value: undefined, done: true });

      expect(await iter1.next()).toEqual({ value: 11, done: false });
      expect(await iter1.next()).toEqual({ value: 12, done: false });
      expect(await iter1.next()).toEqual({ value: 13, done: false });
      expect(await iter1.next()).toEqual({ value: undefined, done: true });
    });

    it("should be forked in the middle of iterable progress", async function () {
      const arr = pipe(
        toAsync([1, 2, 3]),
        map((a) => a + 10),
      );

      const iter1 = fork(arr);
      const iter2 = fork(iter1);

      expect(await arr.next()).toEqual({ value: 11, done: false });
      expect(await iter1.next()).toEqual({ value: 11, done: false });
      expect(await iter2.next()).toEqual({ value: 11, done: false });

      const iter3 = fork(arr);
      const iter4 = fork(iter1);
      expect(await iter1.next()).toEqual({ value: 12, done: false });
      expect(await iter1.next()).toEqual({ value: 13, done: false });
      expect(await iter1.next()).toEqual({ value: undefined, done: true });
      expect(await iter2.next()).toEqual({ value: 12, done: false });
      expect(await iter3.next()).toEqual({ value: 12, done: false });
      expect(await iter4.next()).toEqual({ value: 12, done: false });
    });
  });
});
