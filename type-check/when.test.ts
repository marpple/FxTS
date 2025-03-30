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

checks([
  check<typeof VALUE_1, 100, Test.Pass>(),
  check<typeof check1, string, Test.Pass>(),
  check<typeof check2, number, Test.Pass>(),
  check<typeof check3, typeof VALUE_2 | string, Test.Pass>(),
  check<typeof check4, typeof VALUE_2 | string, Test.Pass>(),
]);
