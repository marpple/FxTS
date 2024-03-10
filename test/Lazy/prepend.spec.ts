import {
  concurrent,
  delay,
  map,
  pipe,
  prepend,
  range,
  toArray,
  toAsync,
} from "../../src/index";

describe("prepend", function () {
  describe("sync", function () {
    it("should be prepended the contents of the given element", function () {
      expect([...prepend("a", ["b", "c"])]).toEqual(["a", "b", "c"]);
    });

    it("should be prepended the contents of the given element 'Iterator'", function () {
      expect([...prepend("a", ["b", "c"][Symbol.iterator]())]).toEqual([
        "a",
        "b",
        "c",
      ]);
    });

    it("should be able to be used as a curried function in the pipeline", function () {
      const res = pipe(
        range(4, 7),
        (a) => a,
        prepend(3),
        prepend(2),
        prepend(1),
        toArray,
      );
      expect(res).toEqual([1, 2, 3, 4, 5, 6]);
    });
  });

  describe("async", function () {
    it("should be prepended the contents of the given element", async function () {
      const res = await pipe(
        toAsync([2, 3, 4]),
        (iter) => prepend(delay(1000, 1), iter),
        toArray,
      );
      expect(res).toEqual([1, 2, 3, 4]);
    });

    it("should be prepend the given element sequentially", async function () {
      let chainedPromise: Promise<number | void> = Promise.resolve();
      const res = await pipe(
        toAsync(range(4, 7)),
        (iter) =>
          prepend(
            (chainedPromise = chainedPromise.then(() => delay(1000, 3))),
            iter,
          ),
        (iter) =>
          prepend(
            (chainedPromise = chainedPromise.then(() => delay(1000, 2))),
            iter,
          ),
        (iter) =>
          prepend(
            (chainedPromise = chainedPromise.then(() => delay(1000, 1))),
            iter,
          ),
        toArray,
      );
      expect(res).toEqual([1, 2, 3, 4, 5, 6]);
    }, 3050);

    it("should be prepend the given element concurrently", async function () {
      const res = await pipe(
        toAsync([4, 5, 6]),
        map((a) => delay(1000, a)),
        (iter) => prepend(Promise.resolve(3), iter),
        (iter) => prepend(Promise.resolve(2), iter),
        (iter) => prepend(Promise.resolve(1), iter),
        concurrent(3),
        toArray,
      );
      expect(res).toEqual([1, 2, 3, 4, 5, 6]);
    }, 1050);

    it("should be able to be used as a curried function in the pipeline", async function () {
      const res = await pipe(
        toAsync([4, 5, 6]),
        map((a) => delay(1000, a)),
        prepend(3),
        prepend(Promise.resolve(2)),
        prepend(1),
        concurrent(3),
        toArray,
      );
      expect(res).toEqual([1, 2, 3, 4, 5, 6]);
    }, 1050);

    // TODO
    // it("should be passed concurrent object when job works concurrently", async function () {
    //   const mock = generatorMock();
    //   const iter = prepend(5, mock);
    //   const concurrent = Concurrent.of(2) as any;

    //   await iter.next(concurrent);
    //   expect((mock as any).getConcurrent()).toEqual(concurrent);
    // });
  });
});
