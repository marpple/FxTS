import { isString, pipe, when } from "../src";

describe("when", function () {
  describe("with a general predicate", () => {
    const test = <T>(value: T) =>
      when(
        (value) => value === 100,
        (value) => {
          expect(value).toBeTruthy();
          return "value is 100";
        },
        value,
      );
    const withPipe = <T>(value: T) =>
      pipe(
        value,
        test,
        when(isString, () => "Hello fxts"),
      );

    it("If the input value is a number 100, the callback is executed and returns its result.", () => {
      const INPUT_VALUE = 100;
      expect(test(INPUT_VALUE)).toBe("value is 100");
    });

    it("If the input value does not match predicate, it returns the original value.", () => {
      const INPUT_VALUE = "Hello World";
      expect(test(INPUT_VALUE)).toBe("Hello World");
    });

    it("If nothing matches, all 'when' functions will be passed.", () => {
      const INPUT_VALUE = [1, 2, 3, 4];
      expect(test(INPUT_VALUE)).toEqual(INPUT_VALUE);
      expect(withPipe(INPUT_VALUE)).toEqual(INPUT_VALUE);
    });
  });

  describe("with a type guard predicate", () => {
    type Shape =
      | { type: "circle"; radius: number }
      | { type: "square"; side: number };

    const isCircle = (
      shape: Shape,
    ): shape is { type: "circle"; radius: number } => shape.type === "circle";

    it("should return the result of the callback when the type guard is true", () => {
      const myShape: Shape = { type: "circle", radius: 10 };
      const result = when(
        isCircle,
        (circle) => `A circle with radius ${circle.radius}`,
        myShape,
      );
      expect(result).toBe("A circle with radius 10");
    });

    it("should return the original value when the type guard is false", () => {
      const anotherShape: Shape = { type: "square", side: 5 };
      const result = when(
        isCircle,
        (circle) => `A circle with radius ${circle.radius}`,
        anotherShape,
      );
      expect(result).toEqual(anotherShape);
    });

    it("should work correctly with pipe", () => {
      const myShape: Shape = { type: "circle", radius: 10 };
      const anotherShape: Shape = { type: "square", side: 5 };

      const shapeHandler = when(
        isCircle,
        (circle) => `A circle with radius ${circle.radius}`,
      );

      expect(pipe(myShape, shapeHandler)).toBe("A circle with radius 10");
      expect(pipe(anotherShape, shapeHandler)).toEqual(anotherShape);
    });
  });
});
