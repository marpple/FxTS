import resolveProps from "../src/resolveProps";

describe("resolveProps", () => {
  it("should resolve an object of promises to a promise of an object", async () => {
    const obj = {
      a: Promise.resolve(1),
      b: Promise.resolve("2"),
      c: Promise.resolve(true),
      d: "non-promise value",
    };

    const result = await resolveProps(obj);
    expect(result).toEqual({ a: 1, b: "2", c: true, d: "non-promise value" });
  });
});
