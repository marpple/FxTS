import { noop } from "../src/index";

describe("noop", function () {
  it("should return `undefined`", function () {
    expect(noop()).toEqual(undefined);
  });
});
