import {
  entries,
  filter,
  fromEntries,
  fx,
  groupBy,
  map,
  pipe,
  reduce,
  toArray,
  toAsync,
} from "../src";
import { AsyncFunctionException } from "../src/_internal/error";

type Obj = {
  category: "clothes" | "pants" | "shoes";
  desc?: string;
};
const given: Obj[] = [
  { category: "clothes", desc: "good" },
  { category: "pants", desc: "bad" },
  { category: "shoes", desc: "not bad" },
  { category: "shoes", desc: "great" },
  { category: "pants", desc: "good" },
];
const then1 = {
  clothes: [{ category: "clothes", desc: "good" }],
  pants: [
    { category: "pants", desc: "bad" },
    { category: "pants", desc: "good" },
  ],
  shoes: [
    { category: "shoes", desc: "not bad" },
    { category: "shoes", desc: "great" },
  ],
};

const then2 = {
  pants: [
    { category: "pants", desc: "bad" },
    { category: "pants", desc: "good" },
  ],
  shoes: [
    { category: "shoes", desc: "not bad" },
    { category: "shoes", desc: "great" },
  ],
};

describe("groupBy", function () {
  describe("sync", function () {
    it("should be grouped by callback to given 'Iterable'", function () {
      const res = groupBy((a) => a.category, given);
      expect(res).toEqual(then1);
    });

    it("should be able to be used as a curried function in the pipeline", function () {
      const res = pipe(
        given,
        filter((a) => a.category !== "clothes"),
        groupBy((a) => a.category),
      );

      expect(res).toEqual(then2);
    });

    it("should be able to be used as a chaining method in the `fx`", function () {
      const res = fx(given)
        .filter((a) => a.category !== "clothes")
        .groupBy((a) => a.category);

      expect(res).toEqual(then2);
    });

    it("should throw an error when the callback is asynchronous", function () {
      const res = () =>
        pipe(
          given,
          filter((a) => a.category !== "clothes"),
          groupBy((a) => Promise.resolve(a.category)),
        );
      expect(res).toThrowError(new AsyncFunctionException());
    });
  });

  describe("async", function () {
    it("should be grouped by the callback to given 'AsyncIterable'", async function () {
      const res = await groupBy((a) => a.category, toAsync(given));
      expect(res).toEqual(then1);
    });

    it("should be able to be used as a curried function in the pipeline", async function () {
      const res = await pipe(
        toAsync(given),
        filter((a) => a.category !== "clothes"),
        groupBy((a) => a.category),
      );

      expect(res).toEqual(then2);
    });

    it("should be able to be used as a chaining method in the `fx`", async function () {
      const res = await fx(toAsync(given))
        .filter((a) => a.category !== "clothes")
        .groupBy((a) => a.category);

      expect(res).toEqual(then2);
    });
  });

  describe("Issue #233 - enum and union types", function () {
    enum Status {
      Todo = "TODO",
      InProgress = "IN_PROGRESS",
      Done = "DONE",
    }

    it("should work with enum types in entries + reduce pattern", function () {
      const tasks = [
        { id: 1, status: Status.Todo, priority: 3 },
        { id: 2, status: Status.InProgress, priority: 5 },
        { id: 3, status: Status.Done, priority: 1 },
        { id: 4, status: Status.Todo, priority: 2 },
      ];

      const result = pipe(
        tasks,
        groupBy((t) => t.status),
        entries,
        map(
          ([status, items]) =>
            [
              status,
              reduce((sum, item) => sum + item.priority, 0, items),
            ] as const,
        ),
        fromEntries,
      );

      expect(result).toEqual({
        [Status.Todo]: 5,
        [Status.InProgress]: 5,
        [Status.Done]: 1,
      });
    });

    it("should work with string union types", function () {
      type Color = "red" | "green" | "blue";
      const items: Array<{ name: string; color: Color; value: number }> = [
        { name: "apple", color: "red", value: 10 },
        { name: "grass", color: "green", value: 20 },
        { name: "sky", color: "blue", value: 30 },
        { name: "rose", color: "red", value: 15 },
      ];

      const result = pipe(
        items,
        groupBy((item) => item.color),
        entries,
        map(([color, items]) => ({
          color,
          total: reduce((sum, item) => sum + item.value, 0, items),
          count: items.length,
        })),
        toArray,
      );

      expect(result).toEqual([
        { color: "red", total: 25, count: 2 },
        { color: "green", total: 20, count: 1 },
        { color: "blue", total: 30, count: 1 },
      ]);
    });

    it("should work with string literal types", function () {
      const data = [
        { type: "A" as const, amount: 100 },
        { type: "B" as const, amount: 200 },
        { type: "A" as const, amount: 150 },
      ];

      const result = pipe(
        data,
        groupBy((item) => item.type),
        entries,
        map(([type, items]) => ({
          type,
          sum: reduce((acc, cur) => acc + cur.amount, 0, items),
        })),
        toArray,
      );

      expect(result).toEqual([
        { type: "A", sum: 250 },
        { type: "B", sum: 200 },
      ]);
    });

    it("should handle numeric enum values", function () {
      enum NumericStatus {
        Pending = 0,
        Active = 1,
        Completed = 2,
      }

      const data = [
        { id: 1, status: NumericStatus.Pending },
        { id: 2, status: NumericStatus.Active },
        { id: 3, status: NumericStatus.Pending },
      ];

      const result = groupBy((item) => item.status, data);

      expect(result).toEqual({
        [NumericStatus.Pending]: [
          { id: 1, status: NumericStatus.Pending },
          { id: 3, status: NumericStatus.Pending },
        ],
        [NumericStatus.Active]: [{ id: 2, status: NumericStatus.Active }],
      });
    });

    it("should handle const assertions", function () {
      const CONFIG = {
        TYPES: {
          ADMIN: "admin",
          USER: "user",
          GUEST: "guest",
        },
      } as const;

      const users = [
        { name: "Alice", type: CONFIG.TYPES.ADMIN },
        { name: "Bob", type: CONFIG.TYPES.USER },
        { name: "Charlie", type: CONFIG.TYPES.USER },
      ];

      const result = groupBy((user) => user.type, users);

      expect(result).toEqual({
        [CONFIG.TYPES.ADMIN]: [{ name: "Alice", type: CONFIG.TYPES.ADMIN }],
        [CONFIG.TYPES.USER]: [
          { name: "Bob", type: CONFIG.TYPES.USER },
          { name: "Charlie", type: CONFIG.TYPES.USER },
        ],
      });
    });

    it("should work with async callback and union types", async function () {
      type Priority = "low" | "medium" | "high";
      const items: Array<{ name: string; priority: Priority }> = [
        { name: "task1", priority: "low" },
        { name: "task2", priority: "high" },
        { name: "task3", priority: "low" },
      ];

      const result = await pipe(
        toAsync(items),
        groupBy(async (item) => item.priority),
      );

      expect(result).toEqual({
        low: [
          { name: "task1", priority: "low" },
          { name: "task3", priority: "low" },
        ],
        high: [{ name: "task2", priority: "high" }],
      });
    });
  });
});
