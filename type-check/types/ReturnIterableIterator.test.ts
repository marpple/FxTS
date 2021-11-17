import * as Test from "../../src/types/Test";
import ReturnIterableIteratorType from "../../src/types/ReturnIterableIteratorType";

const { checks, check } = Test;

checks([
  check<
    ReturnIterableIteratorType<[number], string>,
    IterableIterator<string>,
    Test.Pass
  >(),

  check<
    ReturnIterableIteratorType<Iterable<number>, string>,
    IterableIterator<string>,
    Test.Pass
  >(),

  check<
    ReturnIterableIteratorType<AsyncIterable<number>, string>,
    AsyncIterableIterator<string>,
    Test.Pass
  >(),

  check<
    ReturnIterableIteratorType<AsyncIterable<number>>,
    AsyncIterableIterator<number>,
    Test.Pass
  >(),
]);
