import { always } from "../src";

describe("always", function () {
  it("should always return the specified value", function () {
    const returnValue = { key: "value" };
    expect(always(returnValue)()).toBe(returnValue);
    expect(always(returnValue)("")).toBe(returnValue);
    expect(always(returnValue)(1, 2)).toBe(returnValue);

    expect(always(undefined)()).toBeUndefined();
    expect(always(undefined)("")).toBeUndefined();
    expect(always(undefined)(1, 2)).toBeUndefined();

    expect(always(null)()).toBeNull();
    expect(always(null)("")).toBeNull();
    expect(always(null)(1, 2)).toBeNull();
  });
});
