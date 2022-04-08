import { filter, lt, pipe, toArray } from "../src/index";

describe("lt(little)", function () {
  it("given array then should return little values", function () {
    const result = pipe([4, 5, 6], filter(lt(5)), toArray);
    expect(result).toEqual([4]);
  });
  it("given array then should return empty array", function () {
    const result = pipe([5, 6, 7], filter(lt(5)), toArray);
    expect(result).toEqual([]);
  });

  it("given string array then should return [a, b, c]", function () {
    const result = pipe(["a", "b", "c", "d", "e"], filter(lt("d")), toArray);
    expect(result).toEqual(["a", "b", "c"]);
  });
  it("given string array then should return empty array", function () {
    const result = pipe(["a", "b", "c", "d"], filter(lt("a")), toArray);
    expect(result).toEqual([]);
  });
});
