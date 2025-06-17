import { debounce } from "../../src";
import * as Test from "../../src/types/Test";

const { checks, check } = Test;

declare function fn(a: number): void;
const res1 = debounce(fn, 300);

checks([check<typeof res1, typeof fn & { cancel: () => void }, Test.Pass>()]);
