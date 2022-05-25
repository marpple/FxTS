import * as Test from "../src/types/Test";
import compactObject from "../src/compactObject";

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
};

type Result = {
  a: number;
  b: string | undefined;
  c: boolean | undefined;
  d: number | undefined;
  e: string | undefined;
  f: string | undefined;
};

const res = compactObject({} as Input);

checks([check<typeof res, Result, Test.Pass>()]);
