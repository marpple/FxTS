import * as Test from "../src/types/Test";
import { isObject } from "../src";

const { checks, check } = Test;

const res1 = isObject({});
const res2 = isObject("a");
const res3 = isObject(() => "");
const res4 = isObject(Math.random() > 0.5 ? {} : null);

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
]);
