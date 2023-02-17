import {
  concurrent,
  delay,
  filter,
  map,
  pipe,
  split,
  toArray,
  toAsync,
} from "../../src";
import { Concurrent } from "../../src/Lazy/concurrent";
import { callFuncAfterTime, generatorMock } from "../utils";

describe("split", function () {
  describe("sync", function () {
    it("should return an empty array", function () {
      const iter = split("", "");
      expect([...iter]).toEqual([]);
    });

    it("should be splited by empty string", function () {
      const iter = split("", "abcdefg");
      expect([...iter]).toEqual(["a", "b", "c", "d", "e", "f", "g"]);
    });

    it("should be splited by separator", function () {
      const iter = split(",", "a,b,c,d,e,f,g");
      expect([...iter]).toEqual(["a", "b", "c", "d", "e", "f", "g"]);
    });

    it("should be appended empty string if there is a separator at the end", function () {
      const iter = split(",", "a,b,c,d,e,f,g,");
      expect([...iter]).toEqual(["a", "b", "c", "d", "e", "f", "g", ""]);
    });

    it("should be splited by separator(unicode)", function () {
      const iter = split(",", "👍,😀,🙇‍♂️,🤩,🎉");
      expect([...iter]).toEqual(["👍", "😀", "🙇‍♂️", "🤩", "🎉"]);
    });

    it("should be able to be used as a curried function in the pipeline", function () {
      const res = pipe(
        "1,2,3,4,5,6,7,8,9,10",
        split(","),
        map((a) => Number(a)),
        filter((a) => a % 2 === 0),
        toArray,
      );

      expect(res).toEqual([2, 4, 6, 8, 10]);
    });
  });

  describe("async", function () {
    it("should return an empty array", async function () {
      const acc = [];
      for await (const a of split("", toAsync(""))) {
        acc.push(a);
      }
      expect(acc).toEqual([]);
    });

    it("should be splited by empty string", async function () {
      const acc = [];
      for await (const a of split("", toAsync("abcdefg"))) {
        acc.push(a);
      }
      expect(acc).toEqual(["a", "b", "c", "d", "e", "f", "g"]);
    });

    it("should be splited by separator", async function () {
      const acc = [];
      for await (const a of split(",", toAsync("a,b,c,d,e,f,g"))) {
        acc.push(a);
      }
      expect(acc).toEqual(["a", "b", "c", "d", "e", "f", "g"]);
    });

    it("should be appended empty string if there is a separator at the end", async function () {
      const acc = [];
      for await (const a of split(",", toAsync("a,b,c,d,e,f,g,"))) {
        acc.push(a);
      }
      expect(acc).toEqual(["a", "b", "c", "d", "e", "f", "g", ""]);
    });

    it("should be splited by separator(unicode)", async function () {
      const acc = [];
      for await (const a of split(",", toAsync("👍,😀,🙇‍♂️,🤩,🎉"))) {
        acc.push(a);
      }
      expect(acc).toEqual(["👍", "😀", "🙇‍♂️", "🤩", "🎉"]);
    });

    it("should be able to be used as a curried function in the pipeline", async function () {
      const res = await pipe(
        toAsync("1,2,3,4,5,6,7,8,9,10"),
        split(","),
        map((a) => Number(a)),
        filter((a) => a % 2 === 0),
        toArray,
      );

      expect(res).toEqual([2, 4, 6, 8, 10]);
    });

    it("should be controlled the order when concurrency", async function () {
      const fn = jest.fn();
      callFuncAfterTime(fn, 1000);

      const res = await pipe(
        toAsync(
          (function* () {
            yield delay(500, "1");
            yield delay(400, ",");
            yield delay(300, "2");
            yield delay(200, ",");
            yield delay(100, "3");
            yield delay(500, ",");
            yield delay(400, "4");
            yield delay(300, ",");
            yield delay(200, "5");
          })(),
        ),
        split(","),
        concurrent(5),
        toArray,
      );

      expect(fn).toBeCalled();
      expect(res).toEqual(["1", "2", "3", "4", "5"]);
    }, 1050);

    it("should be consumed concurrently", async function () {
      const fn = jest.fn();
      callFuncAfterTime(fn, 1000);

      const res = await pipe(
        toAsync("1,2,3,4,5,6,7,8,9,10"),
        split(","),
        map((a) => delay(500, a)),
        map((a) => Number(a)),
        filter((a) => a % 2 === 0),
        concurrent(5),
        toArray,
      );

      expect(fn).toBeCalled();
      expect(res).toEqual([2, 4, 6, 8, 10]);
    }, 1050);
  });

  it("should be passed concurrent object when job works concurrently", async function () {
    const mock = generatorMock();
    const iter = split(",", mock as AsyncIterable<string>);
    const concurrent = Concurrent.of(2) as any;

    await iter.next(concurrent);
    expect((mock as any).getConcurrent()).toEqual(concurrent);
  });
});
