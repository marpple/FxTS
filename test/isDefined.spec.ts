import isDefined from "../src/isDefined";

describe("isDefined", function () {
  it.each([2, true, null, {}, [], Symbol("a"), "a"])(
    "given non undefined then should be true",
    function (a) {
      const result = isDefined(a);
      expect(result).toEqual(true);
    },
  );

  it("given undefined then should be false", function () {
    const result = isDefined(undefined);
    expect(result).toEqual(false);
  });
});
