import { filter, isObject, pipe, toArray } from "../src";
import * as Test from "../src/types/Test";

const { checks, check } = Test;

const res1 = isObject({});
const res2 = isObject("a");
const res3 = isObject(() => "");
const res4 = isObject(Math.random() > 0.5 ? {} : null);

const res5 = pipe(
  [{}, { a: 1 }],

  filter(isObject),

  toArray,
);

const res6 = pipe(
  [1, 2, null],

  filter(isObject),

  toArray,
);

type Node = {
  id: number;
  name: string;
  child?: Node | number;
};

function getChildNodeId(node: Node) {
  if (isObject(node.child)) {
    return node.child.id;
  } else {
    return node.child ?? -1;
  }
}

checks([
  check<typeof res1, boolean, Test.Pass>(),
  check<typeof res2, boolean, Test.Pass>(),
  check<typeof res3, boolean, Test.Pass>(),
  check<typeof res4, boolean, Test.Pass>(),
  check<ReturnType<typeof getChildNodeId>, number, Test.Pass>(),
  check<typeof res5, { a?: number }[], Test.Pass>(),
  check<typeof res6, never[], Test.Pass>(),
]);
