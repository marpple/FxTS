import type ReturnPipeType from "../../src/types/ReturnPipeType";
import * as Test from "../../src/types/Test";

const { checks, check } = Test;

// prettier-ignore
checks([
  check<ReturnPipeType<[number]>, number, Test.Pass>(),
  check<ReturnPipeType<[number, string]>, string, Test.Pass>(),
  check<ReturnPipeType<[number, Promise<string>]>, Promise<string>, Test.Pass>(),
  check<ReturnPipeType<[number, Promise<string>, number]>, Promise<number>, Test.Pass>(),
]);
