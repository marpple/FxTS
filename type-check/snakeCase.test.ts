import { snakeCase } from "../src";
import * as Test from "../src/types/Test";

const { checks, check } = Test;

const res1 = snakeCase("foo bar");

checks([check<typeof res1, string, Test.Pass>()]);
