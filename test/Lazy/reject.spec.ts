import { pipe, range, reject, toArray, toAsync } from "../../src/index";

const mod = (a: number) => a % 2 === 0;
const modAsync = async (a: number) => a % 2 === 0;

describe("reject", () => {
  describe("sync", () => {
    it("should be rejected by the callback", () => {
      const res = [...reject(mod, range(1, 10))];
      expect(res).toEqual([1, 3, 5, 7, 9]);
    });

    it("should be able to handle an error", function () {
      expect(() =>
        toArray(
          reject(() => {
            throw new Error("err");
          }, range(1, 10)),
        ),
      ).toThrow("err");
    });

    it("should be able to be used as a curried function in the pipeline", () => {
      const res1 = pipe(
        [1, 2, 3, 4],
        reject((a) => a % 2 === 0),
        toArray,
      );

      expect(res1).toEqual([1, 3]);

      const res2 = pipe(
        [1, 2, null, 3, undefined, 4],
        reject((a) => a),
        toArray,
      );

      expect(res2).toEqual([null, undefined]);
    });
  });
  describe("async", () => {
    it("should be rejected by the callback", async () => {
      const res: number[] = [];
      const iter = reject(modAsync, toAsync(range(1, 10)));
      for await (const item of iter) {
        res.push(item);
      }
      expect(res).toEqual([1, 3, 5, 7, 9]);
    });

    it("should be able to handle an error", async () => {
      await expect(
        toArray(
          reject(() => {
            throw new Error("err");
          }, toAsync(range(1, 10))),
        ),
      ).rejects.toThrow("err");
    });

    it("should be able to handle an error when the callback is asynchronous", async () => {
      await expect(
        toArray(
          reject(() => Promise.reject(new Error("err")), toAsync(range(1, 10))),
        ),
      ).rejects.toThrow("err");
    });

    it("should be able to be used as a curried function in the pipeline", async () => {
      const res = await pipe(
        toAsync([1, 2, 3, 4]),
        reject((a) => a % 2 === 0),
        toArray,
      );

      expect(res).toEqual([1, 3]);
    });
  });
});
