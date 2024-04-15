import { entries, filter, map, pipe, throwError, toArray } from "../src";
import * as Test from "../src/types/Test";

const { checks, check } = Test;

const res1 = pipe(1, String);
const res2 = pipe("1", Number);

const res3 = pipe(Promise.resolve(1), String);
const res4 = pipe(Promise.resolve("1"), Number);

const res5 = pipe(1, (a) => Promise.resolve(String(a)));
const res6 = pipe("1", (a) => Promise.resolve(Number(a)));

const res7 = pipe(Promise.resolve(1), (a) => Promise.resolve(String(a)));
const res8 = pipe(Promise.resolve("1"), (a) => Promise.resolve(Number(a)));

const res9 = pipe(
  "a" as "a" | "b",
  (a) => a.toUpperCase(),
  () => 1,
);

const res10 = pipe(
  Promise.resolve("a") as Promise<"a"> | "a",
  (a) => a.toUpperCase(),
  () => 1,
);

const res11 = pipe(
  Promise.resolve("a") as Promise<"a"> | "a",
  (a) => Promise.resolve(a.toUpperCase()),
  () => 1,
);

const res12 = pipe(
  Promise.resolve("a") as Promise<"a"> | "a",
  (a) => a.toUpperCase(),
  () => Promise.resolve(1),
);

const res13 = pipe(
  Promise.resolve("a") as Promise<"a"> | "a",
  (a) => (Math.random() > 0.5 ? a.toUpperCase() : Promise.resolve("hi")),
  () => 1,
);

const res14 = pipe(
  0,
  throwError(() => Error()),
);

const res15 = pipe(
  0,
  async () => 1,
  throwError(() => Error()),
);

const res16 = pipe(
  0,
  throwError(() => Error()),
  async () => 1,
  () => 2,
);

const res17 = pipe(
  0,
  async () => {
    throw Error("");
  },
  throwError(() => Error("")),
  () => 1,
  () => 2,
);

const Code = {
  None: "NONE",
  _00: "00",
  _11: "11",
  _13: "13",
  _15: "15",
  _17: "17",
  _19: "19",
  _21: "21",
  _23: "23",
  _25: "25",
  _27: "27",
  _29: "29",
  _32: "32",
  _34: "34",
  _41: "41",
  _43: "43",
  _46: "46",
  _52: "52",
  _54: "54",
  _56: "56",
  _58: "58",
  _62: "62",
  _64: "64",
  _66: "66",
  _68: "68",
  _72: "72",
  _81: "81",
  _83: "83",
  _85: "85",
  _96: "96",
  _10: "10",
  _12: "12",
  _14: "14",
  _16: "16",
  _18: "18",
  _20: "20",
  _22: "22",
  _24: "24",
  _26: "26",
  _28: "28",
  _31: "31",
  _33: "33",
  _36: "36",
  _42: "42",
  _44: "44",
  _51: "51",
  _53: "53",
  _55: "55",
  _57: "57",
  _61: "61",
  _63: "63",
  _65: "65",
  _67: "67",
  _71: "71",
  _73: "73",
  _74: "74",
  _75: "75",
  _76: "76",
  _82: "82",
  _84: "84",
  _95: "95",
} as const;

type Code = (typeof Code)[keyof typeof Code];
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const res18 = pipe({ code: Code.None }, (_: { code: Code }): Code => Code.None);
const res19 = pipe(
  { code: Code.None },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (_: { code: Code }): Promise<Code> => Code.None,
);

interface Data {
  a?: {
    value: string;
    order: string;
  };
  b?: {
    value: string;
    order: string;
  };
}

const data: Data = {
  a: {
    value: "a",
    order: "1",
  },
  b: {
    value: "b",
    order: "2",
  },
};

const res20 = pipe(
  data,
  entries,
  filter(([, value]) => value != null),
  map(([key]) => key),
  toArray,
);

checks([
  check<typeof res1, string, Test.Pass>(),
  check<typeof res2, number, Test.Pass>(),
  check<typeof res3, Promise<string>, Test.Pass>(),
  check<typeof res4, Promise<number>, Test.Pass>(),
  check<typeof res5, Promise<string>, Test.Pass>(),
  check<typeof res6, Promise<number>, Test.Pass>(),
  check<typeof res7, Promise<string>, Test.Pass>(),
  check<typeof res8, Promise<number>, Test.Pass>(),
  check<typeof res9, number, Test.Pass>(),
  check<typeof res10, number | Promise<number>, Test.Pass>(),
  check<typeof res11, Promise<number>, Test.Pass>(),
  check<typeof res12, Promise<number>, Test.Pass>(),
  check<typeof res13, number | Promise<number>, Test.Pass>(),
  check<typeof res14, never, Test.Pass>(),
  check<typeof res15, Promise<never>, Test.Pass>(),
  check<typeof res16, never, Test.Pass>(),
  check<typeof res17, Promise<never>, Test.Pass>(),
  check<typeof res18, Code, Test.Pass>(),
  check<typeof res19, Promise<Code>, Test.Pass>(),
  check<typeof res20, ("a" | "b")[], Test.Pass>(),
]);
