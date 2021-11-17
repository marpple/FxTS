import { tap } from "../src/index";

describe("tap", function () {
  it("should return the received argument as it is", function () {
    const res = tap((a) => a * 100, 10);
    expect(res).toEqual(10);
  });

  it("should invoke the given callback once", function () {
    const fn = jest.fn((a: number) => a * 100);
    tap(fn, 10);
    expect(fn).toBeCalled();
  });

  it("should be curried when only one function is given as argument", function () {
    let res1 = 10;
    const res2 = tap((a: number) => {
      res1 += a;
      return res1;
    })(50);

    expect(res1).toEqual(60);
    expect(res2).toEqual(50);
  });
});
