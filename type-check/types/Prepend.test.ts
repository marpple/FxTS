import type Prepend from "../../src/types/Prepend";
import * as Test from "../../src/types/Test";

const { checks, check } = Test;

checks([
  check<Prepend<[], number>, [number], Test.Pass>(),
  check<Prepend<[1, true], string>, [string, 1, true], Test.Pass>(),
]);
