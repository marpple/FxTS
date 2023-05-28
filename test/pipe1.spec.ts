import { pipe1 } from "../src";

const add10 = (a: number) => a + 10;
const add10Async = async (a: number) => a + 10;

describe("pipe1", function () {
  describe("sync", function () {
    it("should return the value evaluated by applying the initial value to a given function", function () {
      const result = pipe1(1, add10);
      expect(result).toEqual(11);
    });
  });

  describe("async", function () {
    it("should be have an initial value of 'Promise'", async function () {
      const result = await pipe1(Promise.resolve(1), add10);
      expect(result).toEqual(11);
    });

    it("should work even if the given function is asynchronous", async function () {
      const result = await pipe1(1, add10Async);
      expect(result).toEqual(11);
    });

    it("should work even if the given function is asynchronous and initial value is 'Promise'", async function () {
      const result = await pipe1(Promise.resolve(1), add10Async);
      expect(result).toEqual(11);
    });
  });
});
