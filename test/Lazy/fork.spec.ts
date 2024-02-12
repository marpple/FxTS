import { fork, map, pipe } from "../../src/index";

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
      expect(iter1.next()).toEqual({ value: 11, done: false });
      expect(iter2.next()).toEqual({ value: 11, done: false });

      expect(iter1.next()).toEqual({ value: 12, done: false });
      expect(iter1.next()).toEqual({ value: 13, done: false });
      expect(iter1.next()).toEqual({ value: undefined, done: true });

      expect(iter2.next()).toEqual({ value: 12, done: false });
      expect(iter2.next()).toEqual({ value: 13, done: false });
      expect(iter2.next()).toEqual({ value: undefined, done: true });
    });

    it("should be forked in the middle of iterable progress", function () {
      const arr = pipe(
        [1, 2, 3],
        map((a) => a + 10),
      );

      const iter1 = fork(arr);
      const iter2 = fork(iter1);

      expect(iter1.next()).toEqual({ value: 11, done: false });
      expect(iter2.next()).toEqual({ value: 11, done: false });

      const iter3 = fork(iter1);
      expect(iter1.next()).toEqual({ value: 12, done: false });
      expect(iter1.next()).toEqual({ value: 13, done: false });
      expect(iter1.next()).toEqual({ value: undefined, done: true });
      expect(iter2.next()).toEqual({ value: 12, done: false });
      expect(iter3.next()).toEqual({ value: 12, done: false });
    });
  });
});
