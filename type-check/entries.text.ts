import { entries } from "../src";
import * as Test from "../src/types/Test";

const { checks, check } = Test;

const symbolKey = Symbol("a");
const res1 = entries({ 1: 1, a: "a", [symbolKey]: "a" });

checks([
  check<
    typeof res1,
    Generator<["1", number] | ["a", string], void, any>,
    Test.Pass
  >(),
]);
