import { filter, indexBy, pipe, toAsync } from "../src";
import { AsyncFunctionException } from "../src/_internal/error";

type Obj = {
  category: "clothes" | "pants" | "shoes";
  desc?: string;
};
const given: Obj[] = [
  { category: "clothes", desc: "good" },
  { category: "pants", desc: "bad" },
  { category: "shoes", desc: "not bad" },
];
const then1 = {
  clothes: { category: "clothes", desc: "good" },
  pants: { category: "pants", desc: "bad" },
  shoes: { category: "shoes", desc: "not bad" },
};
const then2 = {
  pants: { category: "pants", desc: "bad" },
  shoes: { category: "shoes", desc: "not bad" },
};

describe("indexBy", function () {
  describe("sync", function () {
    it("should be grouped index by the callback to given 'Iterable'", function () {
      const res = indexBy((a) => a.category, given);
      expect(res).toEqual(then1);
    });

    it("should be able to be used as a curried function in the pipeline", function () {
      const res = pipe(
        given,
        filter((a) => a.category !== "clothes"),
        indexBy((a) => a.category),
      );
      expect(res).toEqual(then2);
    });

    it("should throw an error when the callback is asynchronous", function () {
      const res = () =>
        pipe(
          given,
          filter((a) => a.category !== "clothes"),
          indexBy((a) => Promise.resolve(a.category)),
        );
      expect(res).toThrowError(new AsyncFunctionException());
    });
  });

  describe("async", function () {
    it("should be grouped index by the callback to given 'AsyncIterable'", async function () {
      const res = await indexBy((a) => a.category, toAsync(given));
      expect(res).toEqual(then1);
    });

    it("should be able to be used as a curried function in the pipeline", async function () {
      const res = await pipe(
        toAsync(given),
        filter((a) => a.category !== "clothes"),
        indexBy((a) => a.category),
      );
      expect(res).toEqual(then2);
    });
  });
});
