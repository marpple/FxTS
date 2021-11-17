import { range } from "../../src/index";

describe("range", function () {
  it("start", function () {
    expect([...range(5)]).toEqual([0, 1, 2, 3, 4]);
  });

  it("start end", function () {
    expect([...range(1, 5)]).toEqual([1, 2, 3, 4]);
  });

  it("start end step", function () {
    expect([...range(1, 10, 2)]).toEqual([1, 3, 5, 7, 9]);
  });

  it("negative step", function () {
    expect([...range(1, 10, -2)]).toEqual([]);
    expect([...range(10, 1, -2)]).toEqual([10, 8, 6, 4, 2]);
  });
});
