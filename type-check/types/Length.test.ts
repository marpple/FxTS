import * as Test from "../../src/types/Test";
import Length from "../../src/types/Length";

const { checks, check } = Test;

checks([
  check<Length<[]>, 0, Test.Pass>(),
  check<Length<[1, 2, 3, 4]>, 4, Test.Pass>(),
]);
