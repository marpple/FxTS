import { isNil } from "../src";

describe("isNil", function () {
  it("should check if given value is `null` or `undefined`", function () {
    const res1 = isNil(null);
    expect(res1).toEqual(true);

    const res2 = isNil(undefined);
    expect(res2).toEqual(true);

    const res3 = isNil(3);
    expect(res3).toEqual(false);

    const res4 = isNil("3");
    expect(res4).toEqual(false);

    const res5 = isNil({});
    expect(res5).toEqual(false);

    const res6 = isNil(Symbol("3"));
    expect(res6).toEqual(false);

    const res7 = isNil(false);
    expect(res7).toEqual(false);
  });
});
