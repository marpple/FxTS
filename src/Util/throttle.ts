/**
 * `throttle` function creates a throttled version of a function that can only be invoked at most once per specified time period.
 * Unlike `debounce`, throttle ensures the function is called at regular intervals during continuous invocations, rather than waiting for a pause.
 * This is useful for rate-limiting expensive operations like scroll handlers, window resizing, or API calls.
 *
 * The throttled function supports `leading` and `trailing` edge execution:
 * - `leading`: Execute immediately on the first call
 * - `trailing`: Execute at the end of the throttle period with the latest arguments
 *
 * The throttled function includes a `.cancel()` method to cancel any pending trailing invocations.
 *
 * @example
 * Basic usage (default options - both leading and trailing):
 * ```ts
 * const throttled = throttle((val: number) => {
 *   console.log('val', val);
 * }, 1000);
 *
 * throttled(1); // immediately logs: val 1
 * throttled(2); // ignored
 * throttled(3); // ignored
 * // After 1000ms, logs: val 3 (trailing call with latest args)
 * ```
 *
 * @example
 * Leading edge only (useful for preventing rapid repeated actions):
 * ```ts
 * const throttled = throttle((val: number) => {
 *   console.log('val', val);
 * }, 1000, { leading: true, trailing: false });
 *
 * throttled(1); // immediately logs: val 1
 * throttled(2); // ignored
 * throttled(3); // ignored
 * // After 1000ms, nothing happens
 * ```
 *
 * @example
 * Trailing edge only (useful for batch processing):
 * ```ts
 * const throttled = throttle((val: number) => {
 *   console.log('val', val);
 * }, 1000, { leading: false, trailing: true });
 *
 * throttled(1); // delayed
 * throttled(2); // delayed
 * throttled(3); // delayed
 * // After 1000ms, logs: val 3 (only the latest value)
 * ```
 *
 * @example
 * Canceling pending throttled invocations:
 * ```ts
 * const throttled = throttle((val: number) => {
 *   console.log('val', val);
 * }, 1000);
 *
 * throttled(1); // immediately logs: val 1
 * throttled(2);
 * throttled(3);
 * throttled.cancel(); // cancels pending trailing invocation
 * // Nothing happens after 1000ms
 * ```
 *
 * @example
 * Real-world use case - throttling scroll events:
 * ```ts
 * const handleScroll = throttle(() => {
 *   console.log('Scroll position:', window.scrollY);
 * }, 200);
 *
 * window.addEventListener('scroll', handleScroll);
 *
 * // The handler will fire immediately on first scroll,
 * // then at most once every 200ms during continuous scrolling,
 * // and once more after scrolling stops (trailing edge)
 * ```
 */
function throttle<T extends (...args: any[]) => void>(
  func: T,
  wait: number,
  options = { leading: true, trailing: true },
): ((...args: Parameters<T>) => void) & { cancel: () => void } {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  let lastCallTime: number | undefined;
  let lastArgs: Parameters<T> | undefined;

  const throttled = function (...args: Parameters<T>) {
    const currentTime = Date.now();

    // First call handling
    if (lastCallTime === undefined) {
      if (options.leading) {
        func(...args);
        lastCallTime = currentTime;
      }
      lastArgs = args;

      if (options.trailing) {
        timeoutId = setTimeout(() => {
          // Only call if there were subsequent calls and we haven't already called with these args
          if (
            lastArgs !== undefined &&
            (!options.leading || lastArgs !== args)
          ) {
            func(...lastArgs);
          }
          lastCallTime = undefined;
          lastArgs = undefined;
          timeoutId = undefined;
        }, wait);
      }
      return;
    }

    // Subsequent calls - store latest args but don't reset timer
    lastArgs = args;

    if (options.trailing && !timeoutId) {
      const remainingTime = wait - (currentTime - lastCallTime);

      timeoutId = setTimeout(() => {
        if (lastArgs !== undefined) {
          func(...lastArgs);
          lastCallTime = Date.now();
        }
        lastArgs = undefined;
        timeoutId = undefined;
      }, remainingTime);
    }
  };

  throttled.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = undefined;
    }
    lastCallTime = undefined;
    lastArgs = undefined;
  };

  return throttled;
}

export default throttle;
