import { range, toArray, toAsync } from "../src";

const identityP = <T>(a: T) => Promise.resolve(a);

describe("toArray", function () {
  describe("sync", function () {
    it("should return 'Array<A>' when 'Iterable<A>' is given as an argument", function () {
      const res = toArray(range(5));
      expect(res).toEqual([0, 1, 2, 3, 4]);
    });
    it("should return 'Array<Promise<A>>' when 'Iterable<Promise<A>>' is given as an argument", async function () {
      const numberPromises = toArray(Array.from(range(5)).map(identityP));
      const res = await Promise.all(numberPromises);
      expect(res).toEqual([0, 1, 2, 3, 4]);
    });
  });
  describe("async", function () {
    it("should return 'Promise<Array<A>>' when 'AsyncIterable<A>' is given as an argument", async function () {
      const res = await toArray(toAsync(range(5)));
      expect(res).toEqual([0, 1, 2, 3, 4]);
    });
  });
});
