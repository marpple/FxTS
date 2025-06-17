/**
 * `debounce` function is used to delay the execution of a provided function until after a specified time period has passed since the last time the debounced function was invoked.
 * The function is useful to optimize performance by limiting the rate at which a function is executed, especially in scenarios like handling user input events, scrolling, or resizing.
 * Additionally, the debounce function allows you to execute the function immediately on the first call (when leading is set to true), and it can be canceled manually using the `.cancel()` method.
 *
 * @example
 * ```ts
 * const debounced1 = debounce((val: number)=>{
 *   console.log('val', val);
 * }, 100);
 *
 * debounced1();
 * debounced1();
 * debounced1(); // invoke func after 100ms
 *
 * const debounced2 = debounce((val: number)=>{
 *   console.log('val', val);
 * }, 100, { leading:true });
 * debounced2(); // immediately invoked func
 * debounced2();
 * debounced2(); // invoked func after 100ms
 * 
 
 * const debounced3 = debounce((val: number)=>{
 *   console.log('val', val);
 * }, 100);
 * debounced3();
 * debounced3();
 * debounced3.cancel(); // cancel func
 * ```
 */
function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number,
  options = { leading: false },
): ((...args: Parameters<T>) => void) & { cancel: () => void } {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const debounced = function (...args: Parameters<T>) {
    const callNow = options.leading && !timeoutId;

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      timeoutId = undefined;
      if (!options.leading) {
        func(...args);
      }
    }, wait);

    if (callNow) {
      func(...args);
    }
  };

  debounced.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = undefined;
    }
  };

  return debounced;
}

export default debounce;
