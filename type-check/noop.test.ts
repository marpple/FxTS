import { noop } from "../src";
import * as Test from "../src/types/Test";

const { checks, check } = Test;

const res = noop();

checks([check<typeof res, void, Test.Pass>()]);
