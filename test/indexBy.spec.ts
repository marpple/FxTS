import {
  entries,
  filter,
  fromEntries,
  fx,
  indexBy,
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
];
const then1 = {
  clothes: { category: "clothes", desc: "good" },
  pants: { category: "pants", desc: "bad" },
  shoes: { category: "shoes", desc: "not bad" },
};
const then2 = {
  pants: { category: "pants", desc: "bad" },
  shoes: { category: "shoes", desc: "not bad" },
};

describe("indexBy", function () {
  describe("sync", function () {
    it("should be grouped index by the callback to given 'Iterable'", function () {
      const res = indexBy((a) => a.category, given);
      expect(res).toEqual(then1);
    });

    it("should be able to be used as a curried function in the pipeline", function () {
      const res = pipe(
        given,
        filter((a) => a.category !== "clothes"),
        indexBy((a) => a.category),
      );
      expect(res).toEqual(then2);
    });

    it("should be able to be used as a chaining method in the `fx`", function () {
      const res = fx(given)
        .filter((a) => a.category !== "clothes")
        .indexBy((a) => a.category);
      expect(res).toEqual(then2);
    });

    it("should throw an error when the callback is asynchronous", function () {
      const res = () =>
        pipe(
          given,
          filter((a) => a.category !== "clothes"),
          indexBy((a) => Promise.resolve(a.category)),
        );
      expect(res).toThrowError(new AsyncFunctionException());
    });
  });

  describe("async", function () {
    it("should be grouped index by the callback to given 'AsyncIterable'", async function () {
      const res = await indexBy((a) => a.category, toAsync(given));
      expect(res).toEqual(then1);
    });

    it("should be able to be used as a curried function in the pipeline", async function () {
      const res = await pipe(
        toAsync(given),
        filter((a) => a.category !== "clothes"),
        indexBy((a) => a.category),
      );
      expect(res).toEqual(then2);
    });

    it("should be able to be used as a chaining method in the `fx`", async function () {
      const res = await fx(toAsync(given))
        .filter((a) => a.category !== "clothes")
        .indexBy((a) => a.category);
      expect(res).toEqual(then2);
    });
  });

  describe("enum and union types", function () {
    enum UserRole {
      Admin = "admin",
      User = "user",
      Guest = "guest",
    }

    it("should work with enum types in entries + Object methods pattern", function () {
      const users = [
        { id: 1, name: "Alice", role: UserRole.Admin },
        { id: 2, name: "Bob", role: UserRole.User },
        { id: 3, name: "Charlie", role: UserRole.User }, // overwrites Bob
        { id: 4, name: "Dave", role: UserRole.Guest },
      ];

      const usersByRole = indexBy((user) => user.role, users);

      // Test Object.entries pattern
      const entriesResult = pipe(
        usersByRole,
        entries,
        map(([role, user]) => ({
          role,
          userName: user.name,
          userId: user.id,
        })),
        toArray,
      );

      expect(entriesResult).toEqual([
        { role: "admin", userName: "Alice", userId: 1 },
        { role: "user", userName: "Charlie", userId: 3 }, // last user wins
        { role: "guest", userName: "Dave", userId: 4 },
      ]);

      // Test Object.keys pattern
      const roles = Object.keys(usersByRole);
      expect(roles.sort()).toEqual(["admin", "guest", "user"]);

      // Test Object.values pattern
      const users_values = Object.values(usersByRole);
      expect(users_values.map((u) => u.name).sort()).toEqual([
        "Alice",
        "Charlie",
        "Dave",
      ]);
    });

    it("should work with string union types", function () {
      type Priority = "low" | "medium" | "high";
      const tasks: Array<{ id: number; title: string; priority: Priority }> = [
        { id: 1, title: "Task 1", priority: "low" },
        { id: 2, title: "Task 2", priority: "high" },
        { id: 3, title: "Task 3", priority: "medium" },
        { id: 4, title: "Task 4", priority: "high" }, // overwrites Task 2
      ];

      const tasksByPriority = indexBy((task) => task.priority, tasks);

      const result = pipe(
        tasksByPriority,
        entries,
        map(([priority, task]) => ({
          priority,
          taskTitle: task.title,
          isHighPriority: priority === "high",
        })),
        toArray,
      );

      expect(result).toEqual([
        { priority: "low", taskTitle: "Task 1", isHighPriority: false },
        { priority: "high", taskTitle: "Task 4", isHighPriority: true },
        { priority: "medium", taskTitle: "Task 3", isHighPriority: false },
      ]);
    });

    it("should work with string literal types", function () {
      const configs = [
        { key: "theme" as const, value: "dark", userId: 1 },
        { key: "language" as const, value: "ko", userId: 1 },
        { key: "theme" as const, value: "light", userId: 1 }, // overwrites dark theme
      ];

      const configByKey = indexBy((config) => config.key, configs);

      const result = pipe(
        configByKey,
        entries,
        map(
          ([key, config]) =>
            [
              key,
              {
                key,
                value: config.value,
                userId: config.userId,
              },
            ] as const,
        ),
        fromEntries,
      );

      expect(result).toEqual({
        theme: { key: "theme", value: "light", userId: 1 },
        language: { key: "language", value: "ko", userId: 1 },
      });
    });

    it("should handle numeric enum values", function () {
      enum Status {
        Pending = 0,
        Active = 1,
        Completed = 2,
      }

      const items = [
        { id: 1, status: Status.Pending },
        { id: 2, status: Status.Active },
        { id: 3, status: Status.Pending }, // overwrites first pending
      ];

      const result = indexBy((item) => item.status, items);

      expect(result).toEqual({
        [Status.Pending]: { id: 3, status: Status.Pending },
        [Status.Active]: { id: 2, status: Status.Active },
      });

      // Test that Object.entries works
      const entriesWork = Object.entries(result).map(([status, item]) => ({
        status,
        itemId: item.id,
      }));

      expect(entriesWork).toEqual([
        { status: "0", itemId: 3 },
        { status: "1", itemId: 2 },
      ]);
    });

    it("should work with const assertions", function () {
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
        { name: "Charlie", type: CONFIG.TYPES.USER }, // overwrites Bob
      ];

      const result = indexBy((user) => user.type, users);

      expect(result).toEqual({
        [CONFIG.TYPES.ADMIN]: { name: "Alice", type: CONFIG.TYPES.ADMIN },
        [CONFIG.TYPES.USER]: { name: "Charlie", type: CONFIG.TYPES.USER },
      });

      // Test Object operations work
      const typeCount = Object.keys(result).length;
      expect(typeCount).toBe(2);
    });

    it("should work with async callback and union types", async function () {
      type Status = "active" | "inactive" | "pending";
      const items: Array<{ name: string; status: Status }> = [
        { name: "item1", status: "active" },
        { name: "item2", status: "inactive" },
        { name: "item3", status: "active" }, // overwrites item1
      ];

      const result = await pipe(
        toAsync(items),
        indexBy(async (item) => item.status),
      );

      expect(result).toEqual({
        active: { name: "item3", status: "active" },
        inactive: { name: "item2", status: "inactive" },
      });
    });
  });
});
