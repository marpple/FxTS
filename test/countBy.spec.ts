import { countBy, filter, pipe, toAsync } from "../src";
import { AsyncFunctionException } from "../src/_internal/error";

type Obj = {
  category: "clothes" | "pants" | "shoes";
  desc?: string;
};
const given: Obj[] = [
  { category: "clothes", desc: "good" },
  { category: "pants", desc: "bad" },
  { category: "shoes", desc: "not bad" },
  { category: "shoes", desc: "great" },
  { category: "pants", desc: "good" },
];
const then1 = {
  clothes: 1,
  pants: 2,
  shoes: 2,
};
const then2 = {
  pants: 2,
  shoes: 2,
};

describe("countBy", function () {
  describe("sync", function () {
    it("should be counted by callback to the 'Iterable'", function () {
      const res = countBy((a) => a.category, given);
      expect(res).toEqual(then1);
    });

    it("should be able to be used as a curried function in the pipeline", function () {
      const res = pipe(
        given,
        filter((a) => a.category !== "clothes"),
        countBy((a) => a.category),
      );

      expect(res).toEqual(then2);
    });

    it("should throw an error when the callback is asynchronous", function () {
      const res = () =>
        pipe(
          given,
          filter((a) => a.category !== "clothes"),
          countBy((a) => Promise.resolve(a.category)),
        );
      expect(res).toThrowError(new AsyncFunctionException());
    });
  });

  describe("async", function () {
    it("should be counted by callback to the 'AsyncIterable'", async function () {
      const res = await countBy((a) => a.category, toAsync(given));
      expect(res).toEqual(then1);
    });

    it("should be able to be used as a curried function in the pipeline", async function () {
      const res = await pipe(
        toAsync(given),
        filter((a) => a.category !== "clothes"),
        countBy((a) => a.category),
      );
      expect(res).toEqual(then2);
    });
  });
});
