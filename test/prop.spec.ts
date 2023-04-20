import { map, pipe, prop, toArray } from "../src";

describe("prop", function () {
  it.each([
    [[[1, 2, 3, 4, 5], 0] as const, 1],
    [[[1, 2, 3, 4, 5], 1] as const, 2],
    [[[1, 2, 3, 4, 5], 2] as const, 3],
    [[[1, 2, 3, 4, 5], 3] as const, 4],
    [[[1, 2, 3, 4, 5], 4] as const, 5],
  ])(
    "should return value for valid property array %s %s",
    function ([arr, key], result) {
      expect(prop(key, arr)).toBe(result);
    },
  );

  it("should be able to be used as a curried function in the pipeline", function () {
    const res = pipe(
      [
        { name: "foo", value: "foo value" },
        { name: "bar", value: "bar value" },
      ],
      map(prop("name")),
      toArray,
    );

    expect(res).toMatchObject(["foo", "bar"]);
  });

  it.each([
    [[{ a: "1", b: 2, c: true }, "a"] as const, "1"],
    [[{ a: "1", b: 2, c: true }, "b"] as const, 2],
    [[{ a: "1", b: 2, c: true }, "c"] as const, true],
  ])(
    "should return value for valid property obj %s %s",
    function ([arr, key], result) {
      expect(prop(key, arr)).toBe(result);
    },
  );
});
