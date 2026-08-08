import { mapValues, pipe } from "../src";

describe("mapValues", function () {
  it("should map every value with f keeping the keys", function () {
    expect(mapValues((v) => v * 2, { a: 1, b: 2 })).toEqual({ a: 2, b: 4 });
  });

  it("should pass the key as the second argument", function () {
    expect(mapValues((v, k) => `${String(k)}:${v}`, { a: 1, b: 2 })).toEqual({
      a: "a:1",
      b: "b:2",
    });
  });

  it("should return an empty object for an empty object", function () {
    expect(mapValues((v) => v, {})).toEqual({});
  });

  it("should support an asynchronous callback", async function () {
    const res = await mapValues(async (v) => v * 2, { a: 1, b: 2 });
    expect(res).toEqual({ a: 2, b: 4 });
  });

  it("should be able to be used as a curried function in the pipeline", function () {
    const res = pipe(
      { a: 1, b: 2 },
      mapValues((v) => v * 2),
    );
    expect(res).toEqual({ a: 2, b: 4 });
  });

  it("should not modify the given object", function () {
    const obj = { a: 1 };
    mapValues((v) => v * 2, obj);
    expect(obj).toEqual({ a: 1 });
  });
});
