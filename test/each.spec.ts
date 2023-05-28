import { each, map, pipe, range, toAsync } from "../src";

describe("each", function () {
  describe("sync", function () {
    it("should iterate and call the function to each item of 'Iterable'", function () {
      let acc = 0;
      each(
        (a) => {
          acc += a;
        },
        [1, 2, 3, 4, 5],
      );
      expect(acc).toEqual(15);
    });

    it("should be able to be used as a curried function in the pipeline", function () {
      let acc = 0;
      pipe(
        [1, 2, 3, 4],
        map((a) => a + 10),
        each((a) => {
          acc += a;
        }),
      );
      expect(acc).toEqual(50);
    });
  });

  describe("async", function () {
    it("should iterate and call the function to each item of 'AsyncIterable'", async function () {
      let acc = 0;
      await each((a) => {
        acc += a;
      }, toAsync([1, 2, 3, 4, 5]));
      expect(acc).toEqual(15);
    });

    it("should work when the given function is asynchronous", async function () {
      let acc = 0;
      await each(async (a) => {
        acc += a;
      }, toAsync([1, 2, 3, 4, 5]));
      expect(acc).toEqual(15);
    });

    it("should be able to be used as a curried function in the pipeline", async function () {
      let acc = 0;
      await each((a) => {
        acc += a;
      }, toAsync(range(1, 6, 1)));

      expect(acc).toEqual(15);
    });

    it("should throw an error occurs in the callback", async function () {
      let res1 = 0;
      try {
        await each((a) => {
          if (a === 3) {
            throw "err";
          }
          res1 += a;
        }, toAsync(range(1, 6, 1)));
      } catch (err) {
        expect(err).toEqual("err");
      }
      expect(res1).toEqual(3);

      let res2 = 0;
      try {
        await each((a) => {
          if (a === 3) {
            return Promise.reject("err");
          }
          res2 += a;
        }, toAsync(range(1, 6, 1)));
      } catch (err) {
        expect(err).toEqual("err");
      }
      expect(res2).toEqual(3);
    });

    it("should be able to be used as a curried function in the pipeline", async function () {
      let res1 = 0;
      await pipe(
        toAsync([1, 2, 3, 4]),
        map((a) => a + 10),
        each((a) => {
          res1 += a;
        }),
      );
      expect(res1).toEqual(50);

      let res2 = 0;
      await pipe(
        toAsync([1, 2, 3, 4]),
        map((a) => a + 10),
        each(async (a) => {
          res2 += a;
        }),
      );
      expect(res2).toEqual(50);
    });
  });
});
