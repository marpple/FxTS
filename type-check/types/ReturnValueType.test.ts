import type ReturnValueType from "../../src/types/ReturnValueType";
import * as Test from "../../src/types/Test";

const { checks, check } = Test;

checks([
  check<ReturnValueType<[number], string>, string, Test.Pass>(),

  check<ReturnValueType<Iterable<number>, string>, string, Test.Pass>(),

  check<ReturnValueType<Iterable<number>, number>, number, Test.Pass>(),

  check<ReturnValueType<Iterable<number>>, number, Test.Pass>(),

  check<
    ReturnValueType<AsyncIterable<number>, number>,
    Promise<number>,
    Test.Pass
  >(),

  check<
    ReturnValueType<AsyncIterable<number>, string>,
    Promise<string>,
    Test.Pass
  >(),

  check<ReturnValueType<AsyncIterable<number>>, Promise<number>, Test.Pass>(),
]);
