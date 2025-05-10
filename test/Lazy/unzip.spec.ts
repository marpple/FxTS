import {
  // fx,
  join,
  map,
  pipe,
  sum,
  take,
  toArray,
  unzip,
} from "../../src/index";

describe("unzip", function () {
  describe("sync", function () {
    it("should be merged values of each 'Iterable' with value at the corresponding position", function () {
      const res = toArray(unzip([1, 5], [2, 6], [3, 7], [4, 8]));

      expect(res).toEqual([
        [1, 2, 3, 4],
        [5, 6, 7, 8],
      ]);
    });

    it("should be zipped if the iterables have different size", function () {
      const res = toArray(unzip([1, 5], [2, 6], [3, 7], [4, 8, 9]));

      expect(res).toEqual([[1, 2, 3, 4], [5, 6, 7, 8], [9]]);
    });

    it("should be able to be used in the pipeline", function () {
      const res = pipe(
        [1, 5],
        (a) => unzip(a, [2, 6], [3, 7], [4, 8, 9]),
        take(2),
        map(sum),
        toArray,
      );

      expect(res).toEqual([10, 26]);
    });

    it("should be zipped each 'Iterable' having a different type", function () {
      const res = pipe(
        ["a", 1],
        (a) => unzip(a, ["b", 2], ["c", 3]),
        map((value) => join("-", value)),
        toArray,
      );

      expect(res).toEqual(["a-b-c", "1-2-3"]);
    });

    it("should be able to be used as a curried function in the pipeline", async function () {
      const res = pipe([5, 6, 7, 8], unzip([1, 2, 3, 4]), toArray);

      expect(res).toEqual([
        [1, 5],
        [2, 6],
        [3, 7],
        [4, 8],
      ]);
    });

    // TODO: FX 부분 추가할 것
    it("should be able to be used as a chaining method in the `fx`", function () {
      // const res1 = fx([1, 2, 3]).unzip(["5", "6", "7", "8"]).toArray();
      // expect(res1).toEqual([["5", 1], ["6", 2], ["7", 3], ["8"]]);
    });
  });

  // TODO: Async 테스트 추가할 것
  // describe("async", function () {
  //   it("should be merged values of each 'AsyncIterable' with value at the corresponding position", async function () {});

  //   it("should be zipped if the iterables have different size", async function () {});

  //   it("should be zipped 'Iterable' and 'AsyncIterable'", async function () {});

  //   it("should be able to be used in the pipeline", async function () {});

  //   it("should be able to be used as a chaining method in the `fx`", async function () {});

  //   it("should be zipped each 'AsyncIterable' having a different type", async function () {});

  //   it("should be zipped sequentially", async function () {}, 4050);

  //   it("should be zipped concurrently: zip - map", async function () {}, 1050);

  //   it("should be zipped concurrently: map - zip", async function () {}, 1050);

  //   it("should be passed concurrent object when job works concurrently", async function () {});
  // });
});
