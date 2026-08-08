import { escapeRegExp } from "../src";
import * as Test from "../src/types/Test";

const { checks, check } = Test;

const res1 = escapeRegExp("$1.00");

checks([check<typeof res1, string, Test.Pass>()]);
