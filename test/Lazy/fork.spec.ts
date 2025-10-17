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

describe("fork", () => {
  describe("sync", () => {
    it("should be forked iterable(number)", () => {
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

    it("should be forked iterable(string)", () => {
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

    it("should be able to be used as a forked function in the pipeline", () => {
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

    it("forked iterator proceeds independently even if there is no data to process from the original.", () => {
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

    it("should be forked in the middle of iterable progress", () => {
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

  describe("async", () => {
    it("should be forked iterable(number)", async () => {
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

    it("should be forked iterable(string)", async () => {
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

    it("should be able to be used as a forked function in the pipeline", async () => {
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

    it("forked iterator proceeds independently even if there is no data to process from the original", async () => {
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

    it("should be forked in the middle of iterable progress", async () => {
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

    it("forked iterable should be consumed concurrently", async () => {
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

    it("forked iterable should be consumed concurrently (forked iterable first)", async () => {
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

    it("forked iterable and origin iterable must each be consumable.", async () => {
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

  describe("error propagation", () => {
    it("should propagate errors from sync iterator to all forked iterators", () => {
      const errorMsg = "sync error";
      const errorIterator = (function* () {
        yield 1;
        yield 2;
        throw new Error(errorMsg);
      })();

      const iter1 = fork(errorIterator);
      const iter2 = fork(errorIterator);

      expect(errorIterator.next()).toEqual({ value: 1, done: false });
      expect(iter1.next()).toEqual({ value: 1, done: false });
      expect(iter2.next()).toEqual({ value: 1, done: false });

      expect(errorIterator.next()).toEqual({ value: 2, done: false });
      expect(iter1.next()).toEqual({ value: 2, done: false });

      expect(() => errorIterator.next()).toThrow(errorMsg);
      expect(() => iter1.next()).toThrow(errorMsg);
      expect(() => iter2.next()).toThrow(errorMsg);
    });

    it("should propagate errors from async iterator to all forked iterators", async () => {
      const errorMsg = "async error";
      const errorIterator = (async function* () {
        yield 1;
        yield 2;
        throw new Error(errorMsg);
      })();

      const iter1 = fork(errorIterator);
      const iter2 = fork(errorIterator);

      expect(await errorIterator.next()).toEqual({ value: 1, done: false });
      expect(await iter1.next()).toEqual({ value: 1, done: false });
      expect(await iter2.next()).toEqual({ value: 1, done: false });

      expect(await errorIterator.next()).toEqual({ value: 2, done: false });
      expect(await iter1.next()).toEqual({ value: 2, done: false });

      await expect(errorIterator.next()).rejects.toThrow(errorMsg);
      await expect(iter1.next()).rejects.toThrow(errorMsg);
      await expect(iter2.next()).rejects.toThrow(errorMsg);
    });
  });

  describe("memory optimization", () => {
    it("should handle large datasets with multiple forks (sync)", () => {
      const arr = pipe(
        range(500),
        map((a) => a + 1),
      );

      const fork1 = fork(arr);
      const fork2 = fork(arr);
      const fork3 = fork(arr);

      // Fork1 reads first 100
      const results1 = [];
      for (let i = 0; i < 100; i++) {
        results1.push(fork1.next().value);
      }

      // Fork2 reads first 50
      const results2 = [];
      for (let i = 0; i < 50; i++) {
        results2.push(fork2.next().value);
      }

      // Fork3 reads all
      const results3 = [];
      let result = fork3.next();
      while (!result.done) {
        results3.push(result.value);
        result = fork3.next();
      }

      // Verify all forks can still read their data correctly
      expect(results1[0]).toBe(1);
      expect(results1[99]).toBe(100);
      expect(results2[0]).toBe(1);
      expect(results2[49]).toBe(50);
      expect(results3.length).toBe(500);
      expect(results3[0]).toBe(1);
      expect(results3[499]).toBe(500);
    });

    it("should handle large datasets with multiple forks (async)", async () => {
      const arr = pipe(
        toAsync(range(200)),
        map((a) => a + 1),
      );

      const fork1 = fork(arr);
      const fork2 = fork(arr);

      // Fork1 reads first 50
      const results1 = [];
      for (let i = 0; i < 50; i++) {
        results1.push((await fork1.next()).value);
      }

      // Fork2 reads all
      const results2 = [];
      let result = await fork2.next();
      while (!result.done) {
        results2.push(result.value);
        result = await fork2.next();
      }

      // Fork1 continues reading
      let result1 = await fork1.next();
      while (!result1.done) {
        results1.push(result1.value);
        result1 = await fork1.next();
      }

      expect(results1.length).toBe(200);
      expect(results1[0]).toBe(1);
      expect(results1[199]).toBe(200);
      expect(results2.length).toBe(200);
      expect(results2[0]).toBe(1);
      expect(results2[199]).toBe(200);
    });

    it("should remove fork from tracking when completed (sync)", () => {
      const arr = [1, 2, 3];
      const iter1 = fork(arr);
      const iter2 = fork(arr);

      // Consume all from iter1
      while (!iter1.next().done);

      // iter2 should still work
      expect(iter2.next()).toEqual({ value: 1, done: false });
      expect(iter2.next()).toEqual({ value: 2, done: false });
      expect(iter2.next()).toEqual({ value: 3, done: false });
      expect(iter2.next().done).toBe(true);
    });

    it("should remove fork from tracking when completed (async)", async () => {
      const arr = toAsync([1, 2, 3]);
      const iter1 = fork(arr);
      const iter2 = fork(arr);

      // Consume all from iter1
      while (!(await iter1.next()).done);

      // iter2 should still work
      expect(await iter2.next()).toEqual({ value: 1, done: false });
      expect(await iter2.next()).toEqual({ value: 2, done: false });
      expect(await iter2.next()).toEqual({ value: 3, done: false });
      expect((await iter2.next()).done).toBe(true);
    });
  });
});
