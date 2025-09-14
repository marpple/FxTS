import type { ToUpperCase } from "../../src/Type";
import * as Test from "../../src/types/Test";

const { checks, check } = Test;

checks([
  check<ToUpperCase<"helloWorld">, "HELLOWORLD", Test.Pass>(),
  check<ToUpperCase<"helloWorld", "_">, "HELLO_WORLD", Test.Pass>(),
  check<ToUpperCase<"helloWorld", "-">, "HELLO-WORLD", Test.Pass>(),
  check<ToUpperCase<"helloWorld", " ">, "HELLO WORLD", Test.Pass>(),
]);
