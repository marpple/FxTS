import * as Test from "../src/types/Test";
import { noop } from "../src";

const { checks, check } = Test;

const res = noop();

checks([check<typeof res, void, Test.Pass>()]);
