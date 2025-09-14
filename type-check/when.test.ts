import { isNumber, isString, sum, when } from "../src";
import * as Test from "../src/types/Test";

const { checks, check } = Test;

const VALUE_1 = 100;
const VALUE_2 = [1, 2, 3, 4];

const check1 = when(isNumber, (value) => `${value}`, VALUE_1);
const check2 = when(isString, (value) => `${value}`, VALUE_1);
const check3 = when(
  (list) => sum(list) >= 10,
  (value) => `${value}`,
  VALUE_2,
);
const check4 = when(
  (list) => sum(list) > 10,
  (value) => `${value}`,
  VALUE_2,
);

// New test cases for R | Exclude<T, S>
type Shape =
  | { type: "circle"; radius: number }
  | { type: "square"; side: number };
const myShape: Shape = { type: "circle", radius: 10 };
const anotherShape: Shape = { type: "square", side: 5 };

const isCircle = (
  shape: Shape,
): shape is { type: "circle"; radius: number } => {
  return shape.type === "circle";
};

// When predicate is a type guard and is true at runtime
const check5 = when(
  isCircle,
  (circle) => `A circle with radius ${circle.radius}`, // R = string
  myShape,
);

// When predicate is a type guard and is false at runtime
const check6 = when(
  isCircle,
  (circle) => `A circle with radius ${circle.radius}`, // R = string
  anotherShape,
);

// Curried version
const curriedWhen = when(
  isCircle,
  (circle) => `A circle with radius ${circle.radius}`,
);
const check7 = curriedWhen(myShape);

checks([
  check<typeof VALUE_1, 100, Test.Pass>(),
  check<typeof check1, string, Test.Pass>(),
  check<typeof check2, string | number, Test.Pass>(),
  check<typeof check3, typeof VALUE_2 | string, Test.Pass>(),
  check<typeof check4, typeof VALUE_2 | string, Test.Pass>(),
  // --- Added Tests ---
  check<typeof check5, string, Test.Pass>(),
  check<typeof check6, string | { type: "square"; side: number }, Test.Pass>(),
  check<typeof check7, string | { type: "square"; side: number }, Test.Pass>(),
]);
