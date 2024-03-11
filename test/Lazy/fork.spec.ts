import {
  concurrent,
  delay,
  fork,
  map,
  pipe,
  range,
  toArray,
  toAsync,
} from "../../src/index";

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

    it("forked iterable should be consumed concurrently", async function () {
      const iter = pipe(
        toAsync(range(10)),
        map((a) => delay(500, a)),
      );

      const forkedIter = fork(iter);
      const arr1 = await pipe(iter, concurrent(5), toArray);
      expect(arr1).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

      const arr2 = await pipe(forkedIter, concurrent(5), toArray);
      expect(arr2).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    }, 1050);

    it("forked iterable should be consumed concurrently (forked iterable first)", async function () {
      const iter = pipe(
        toAsync(range(10)),
        map((a) => delay(500, a)),
      );

      const forkedIter = fork(iter);
      const arr1 = await pipe(forkedIter, concurrent(5), toArray);
      expect(arr1).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

      const arr2 = await pipe(iter, concurrent(5), toArray);
      expect(arr2).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    }, 1050);

    it("forked iterable and origin iterable must each be consumable.", async function () {
      const origin = pipe(
        toAsync(range(6)),
        map((a) => delay(500, a)),
      );

      const iter = pipe(origin, concurrent(3));
      const forkedIter = pipe(fork(origin), concurrent(3));

      const p1 = await iter.next();
      const pf1 = await forkedIter.next();
      const p2 = await iter.next();
      const pf2 = await forkedIter.next();
      const p3 = await iter.next();
      const pf3 = await forkedIter.next();
      const p4 = await iter.next();
      const pf4 = await forkedIter.next();
      const p5 = await iter.next();
      const pf5 = await forkedIter.next();
      const p6 = await iter.next();
      const pf6 = await forkedIter.next();
      const p7 = await iter.next();
      const pf7 = await forkedIter.next();

      expect(p1).toEqual({ value: 0, done: false });
      expect(p2).toEqual({ value: 1, done: false });
      expect(p3).toEqual({ value: 2, done: false });
      expect(p4).toEqual({ value: 3, done: false });
      expect(p5).toEqual({ value: 4, done: false });
      expect(p6).toEqual({ value: 5, done: false });
      expect(p7).toEqual({ value: undefined, done: true });

      expect(pf1).toEqual({ value: 0, done: false });
      expect(pf2).toEqual({ value: 1, done: false });
      expect(pf3).toEqual({ value: 2, done: false });
      expect(pf4).toEqual({ value: 3, done: false });
      expect(pf5).toEqual({ value: 4, done: false });
      expect(pf6).toEqual({ value: 5, done: false });
      expect(pf7).toEqual({ value: undefined, done: true });
    }, 1050);
  });
});
