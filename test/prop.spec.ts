import { pipe, prop } from "../src";

describe("prop", () => {
  it("should return the value for the given object property", () => {
    const obj = { a: 1, b: "2" };

    expect(prop("a", obj)).toBe(1);
    expect(prop("b", obj)).toBe("2");
    expect(prop("c", obj)).toBe(undefined);
  });

  it("should be able to operate on arrays", () => {
    const arr = ["a", "b", "c"];

    expect(prop(0, arr)).toBe("a");
    expect(prop(1, arr)).toBe("b");
    expect(prop(2, arr)).toBe("c");
    expect(prop(3, arr)).toBe(undefined);
  });

  it("should return undefined when operating on null", () => {
    expect(prop("key", null)).toBe(undefined);
  });

  it("should be able to be used as a curried function in the pipeline", async () => {
    const obj = { label: "value", data: { content: "" } };

    const syncRes = pipe(obj, prop("data"));
    expect(syncRes).toBe(obj.data);

    const asyncRes = await pipe(Promise.resolve(obj), prop("data"));
    expect(asyncRes).toBe(obj.data);
  });
});
