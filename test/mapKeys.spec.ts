import { mapKeys, pipe } from "../src";

describe("mapKeys", function () {
  it("should map every key with f keeping the values", function () {
    expect(mapKeys((v, k) => k.toUpperCase(), { a: 1, b: 2 })).toEqual({
      A: 1,
      B: 2,
    });
  });

  it("should pass the value as the first argument", function () {
    expect(mapKeys((v) => String(v), { a: 1, b: 2 })).toEqual({
      "1": 1,
      "2": 2,
    });
  });

  it("should let the last key win on collision", function () {
    expect(mapKeys(() => "same", { a: 1, b: 2 })).toEqual({ same: 2 });
  });

  it("should support an asynchronous callback", async function () {
    const res = await mapKeys(async (v, k) => k.toUpperCase(), { a: 1 });
    expect(res).toEqual({ A: 1 });
  });

  it("should be able to be used as a curried function in the pipeline", function () {
    const res = pipe(
      { a: 1, b: 2 },
      mapKeys((v, k) => k.toUpperCase()),
    );
    expect(res).toEqual({ A: 1, B: 2 });
  });
});
