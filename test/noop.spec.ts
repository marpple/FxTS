import { noop } from "../src";

describe("noop", function () {
  it("should return `undefined`", function () {
    expect(noop()).toEqual(undefined);
  });
});
