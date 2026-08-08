import { capitalize } from "../src";
import * as Test from "../src/types/Test";

const { checks, check } = Test;

const res1 = capitalize("fred");

checks([check<typeof res1, string, Test.Pass>()]);
