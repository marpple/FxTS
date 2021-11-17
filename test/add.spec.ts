import { add } from "../src";

describe("add", () => {
  it("should be added two number", () => {
    expect(add(2, 3)).toBe(5);
  });
});
