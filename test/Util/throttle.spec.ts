import { throttle } from "../../src";

jest.useFakeTimers();

describe("throttle", () => {
  let callback: jest.Mock;

  beforeEach(() => {
    callback = jest.fn();
  });

  // Basic throttle behavior
  describe("basic throttle behavior", () => {
    test("should throttle function calls within wait period", () => {
      const throttled = throttle(callback, 100);

      throttled();
      expect(callback).toBeCalledTimes(1); // Leading edge

      throttled();
      throttled();
      throttled();
      expect(callback).toBeCalledTimes(1); // Still only 1 call

      jest.advanceTimersByTime(100);
      expect(callback).toBeCalledTimes(2); // Trailing edge
    });

    test("should allow call after throttle period expires", () => {
      const throttled = throttle(callback, 100);

      throttled();
      expect(callback).toBeCalledTimes(1);

      jest.advanceTimersByTime(100);
      expect(callback).toBeCalledTimes(1); // No trailing call (single invocation)

      throttled();
      expect(callback).toBeCalledTimes(2);
    });

    test("should not reset timer on subsequent calls (key difference from debounce)", () => {
      const throttled = throttle(callback, 100);

      throttled();
      expect(callback).toBeCalledTimes(1);

      jest.advanceTimersByTime(50);
      throttled(); // This should NOT reset the timer

      jest.advanceTimersByTime(50); // Total: 100ms from first call
      expect(callback).toBeCalledTimes(2); // Trailing edge fires
    });

    test("should handle multiple consecutive throttle periods", () => {
      const throttled = throttle(callback, 100);

      // First period
      throttled();
      expect(callback).toBeCalledTimes(1);

      jest.advanceTimersByTime(100);

      // Second period
      throttled();
      expect(callback).toBeCalledTimes(2);

      jest.advanceTimersByTime(100);

      // Third period
      throttled();
      expect(callback).toBeCalledTimes(3);
    });
  });

  // Leading edge tests
  describe("leading edge", () => {
    test("should call immediately when leading is true (default)", () => {
      const throttled = throttle(callback, 100);

      throttled();
      expect(callback).toBeCalledTimes(1);
    });

    test("should not call immediately when leading is false", () => {
      const throttled = throttle(callback, 100, {
        leading: false,
        trailing: true,
      });

      throttled();
      expect(callback).not.toBeCalled();

      jest.advanceTimersByTime(100);
      expect(callback).toBeCalledTimes(1);
    });

    test("should handle leading only option", () => {
      const throttled = throttle(callback, 100, {
        leading: true,
        trailing: false,
      });

      throttled();
      expect(callback).toBeCalledTimes(1);

      throttled();
      throttled();

      jest.advanceTimersByTime(100);
      expect(callback).toBeCalledTimes(1); // No trailing call
    });
  });

  // Trailing edge tests
  describe("trailing edge", () => {
    test("should call at end of period when trailing is true (default)", () => {
      const throttled = throttle(callback, 100);

      throttled();
      throttled();
      throttled();

      jest.advanceTimersByTime(100);
      expect(callback).toBeCalledTimes(2); // Leading + trailing
    });

    test("should not call at end when trailing is false", () => {
      const throttled = throttle(callback, 100, {
        leading: true,
        trailing: false,
      });

      throttled();
      throttled();

      jest.advanceTimersByTime(100);
      expect(callback).toBeCalledTimes(1); // Only leading
    });

    test("should use latest arguments for trailing call", () => {
      const cb = jest.fn((val: number) => val);
      const throttled = throttle(cb, 100);

      throttled(1);
      throttled(2);
      throttled(3);

      expect(cb).toBeCalledWith(1); // Leading call

      jest.advanceTimersByTime(100);
      expect(cb).toBeCalledWith(3); // Trailing call with latest args
      expect(cb).toBeCalledTimes(2);
    });

    test("should handle trailing only option", () => {
      const throttled = throttle(callback, 100, {
        leading: false,
        trailing: true,
      });

      throttled();
      expect(callback).not.toBeCalled();

      throttled();
      throttled();

      jest.advanceTimersByTime(100);
      expect(callback).toBeCalledTimes(1); // Only trailing
    });
  });

  // Leading + Trailing combination
  describe("leading and trailing combined", () => {
    test("should call on both edges when both true", () => {
      const throttled = throttle(callback, 100, {
        leading: true,
        trailing: true,
      });

      throttled();
      expect(callback).toBeCalledTimes(1); // Leading

      throttled();
      throttled();

      jest.advanceTimersByTime(100);
      expect(callback).toBeCalledTimes(2); // Trailing
    });

    test("should not call twice if only one call made", () => {
      const throttled = throttle(callback, 100, {
        leading: true,
        trailing: true,
      });

      throttled();
      expect(callback).toBeCalledTimes(1);

      jest.advanceTimersByTime(100);
      expect(callback).toBeCalledTimes(1); // Still only 1 (no duplicate)
    });

    test("should execute leading then trailing with different args", () => {
      const cb = jest.fn((val: number) => val);
      const throttled = throttle(cb, 100, {
        leading: true,
        trailing: true,
      });

      throttled(1);
      expect(cb).toBeCalledWith(1);

      throttled(2);
      throttled(3);

      jest.advanceTimersByTime(100);
      expect(cb).toBeCalledWith(3);
      expect(cb).toBeCalledTimes(2);
    });
  });

  // Cancel functionality
  describe("cancel", () => {
    test("should cancel pending trailing execution", () => {
      const throttled = throttle(callback, 100);

      throttled();
      throttled();

      throttled.cancel();

      jest.advanceTimersByTime(100);
      expect(callback).toBeCalledTimes(1); // Only the leading call
    });

    test("should allow fresh start after cancel", () => {
      const throttled = throttle(callback, 100);

      throttled();
      expect(callback).toBeCalledTimes(1);

      throttled();
      throttled.cancel();

      // Should be able to call immediately after cancel
      throttled();
      expect(callback).toBeCalledTimes(2);
    });
  });

  // Edge cases
  describe("edge cases", () => {
    test("should handle rapid successive calls", () => {
      const throttled = throttle(callback, 100);

      for (let i = 0; i < 10; i++) {
        throttled();
      }

      expect(callback).toBeCalledTimes(1); // Leading only

      jest.advanceTimersByTime(100);
      expect(callback).toBeCalledTimes(2); // Leading + trailing
    });

    test("should preserve call arguments correctly", () => {
      const cb = jest.fn((a: number, b: string, c: boolean) => {
        return [a, b, c];
      });
      const throttled = throttle(cb, 100);

      throttled(1, "a", true);
      expect(cb).toBeCalledWith(1, "a", true);

      throttled(2, "b", false);
      throttled(3, "c", true);

      jest.advanceTimersByTime(100);
      expect(cb).toBeCalledWith(3, "c", true); // Latest args
      expect(cb).toBeCalledTimes(2);
    });

    test("should handle wait time of 0", () => {
      const throttled = throttle(callback, 0);

      throttled();
      expect(callback).toBeCalledTimes(1);

      throttled();

      jest.advanceTimersByTime(0);
      expect(callback).toBeCalledTimes(2);
    });

    test("should handle calls during and after throttle period", () => {
      const throttled = throttle(callback, 100);

      throttled(); // t=0, leading call
      expect(callback).toBeCalledTimes(1);

      jest.advanceTimersByTime(50);
      throttled(); // t=50, within period

      jest.advanceTimersByTime(50); // t=100, trailing call
      expect(callback).toBeCalledTimes(2);

      jest.advanceTimersByTime(50); // t=150
      throttled(); // After period, should call immediately
      expect(callback).toBeCalledTimes(3);
    });

    test("should work with no options provided", () => {
      const throttled = throttle(callback, 100);

      throttled();
      expect(callback).toBeCalledTimes(1);

      throttled();

      jest.advanceTimersByTime(100);
      expect(callback).toBeCalledTimes(2);
    });
  });
});
