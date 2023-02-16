import compactObject from "../src/compactObject";
import * as Test from "../src/types/Test";

const { checks, check } = Test;

type Input = {
  a: number;
  b?: string;
  c: boolean | null;
  d: number | undefined;
  e: string | null | undefined;
  f?: string | null | undefined;
  g: undefined;
  h: null;
  i: null | undefined;
};

type Result = {
  a: number;
  b?: string;
  c?: boolean;
  d?: number;
  e?: string;
  f?: string;
};

const res = compactObject({} as Input);

checks([check<typeof res, Result, Test.Pass>()]);
