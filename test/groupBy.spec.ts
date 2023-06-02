import { filter, groupBy, pipe, toAsync } from "../src";
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
  clothes: [{ category: "clothes", desc: "good" }],
  pants: [
    { category: "pants", desc: "bad" },
    { category: "pants", desc: "good" },
  ],
  shoes: [
    { category: "shoes", desc: "not bad" },
    { category: "shoes", desc: "great" },
  ],
};

const then2 = {
  pants: [
    { category: "pants", desc: "bad" },
    { category: "pants", desc: "good" },
  ],
  shoes: [
    { category: "shoes", desc: "not bad" },
    { category: "shoes", desc: "great" },
  ],
};

describe("groupBy", function () {
  describe("sync", function () {
    it("should be grouped by callback to given 'Iterable'", function () {
      const res = groupBy((a) => a.category, given);
      expect(res).toEqual(then1);
    });

    it("should be able to be used as a curried function in the pipeline", function () {
      const res = pipe(
        given,
        filter((a) => a.category !== "clothes"),
        groupBy((a) => a.category),
      );

      expect(res).toEqual(then2);
    });

    it("should throw an error when the callback is asynchronous", function () {
      const res = () =>
        pipe(
          given,
          filter((a) => a.category !== "clothes"),
          groupBy((a) => Promise.resolve(a.category)),
        );
      expect(res).toThrowError(new AsyncFunctionException());
    });
  });

  describe("async", function () {
    it("should be grouped by the callback to given 'AsyncIterable'", async function () {
      const res = await groupBy((a) => a.category, toAsync(given));
      expect(res).toEqual(then1);
    });

    it("should be able to be used as a curried function in the pipeline", async function () {
      const res = await pipe(
        toAsync(given),
        filter((a) => a.category !== "clothes"),
        groupBy((a) => a.category),
      );

      expect(res).toEqual(then2);
    });
  });
});
