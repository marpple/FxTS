import { pipe, props, toArray } from "../src";

describe("props", () => {
  const obj = { a: "v1", b: "v2", c: "v3", d: "v4", e: "v5", f: "v6" };

  it("should return empty array if no properties requested", () => {
    expect(props([], obj)).toEqual([]);
  });

  it("should return an array of undefined values if null is given", () => {
    expect(props(["a", "b"], null)).toEqual([undefined, undefined]);
  });

  it("should return values for requested properties", () => {
    expect(props(["a", "e"], obj)).toEqual(["v1", "v5"]);
  });

  it("should preserve order", () => {
    expect(props(["f", "c", "e"], obj)).toEqual(["v6", "v3", "v5"]);
  });

  it("should return undefined for nonexistent properties", () => {
    expect(props(["a", "nonexistent"], obj)).toEqual(["v1", undefined]);
  });

  it("should be able to operate on arrays", () => {
    const arr = ["a", "b", "c"];

    expect(props([0, 1], arr)).toEqual(["a", "b"]);
    expect(props([2, 3], arr)).toEqual(["c", undefined]);
  });

  it("should be able to be used as a curried in the pipeline", async () => {
    const syncRes = pipe(obj, props(["a", "b"]), toArray);
    expect(syncRes).toEqual(["v1", "v2"]);

    const asyncRes = await pipe(Promise.resolve(obj), props(["a", "b"]));
    expect(asyncRes).toEqual(["v1", "v2"]);
  });
});
