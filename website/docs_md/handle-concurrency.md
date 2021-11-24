---
id: handle-concurrency
---

# Handle Concurrency

In javascript, there is a function to evaluate multiple promise values at the same time with [Promise.all](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all).
However, it cannot handle the load of concurrent requests and cannot handle requests for infinite enumerable data sets.
[concurrent](https://fxts.dev/docs/concurrent) can handle asynchronous requests of infinite datasets and can control the request size of the load.

```ts
// prettier-ignore
import { pipe, toAsync, range, map, filter, take, each, concurrent } from "@fxts/core";

const fetchApi = (page) =>
  new Promise((resolve) => setTimeout(() => resolve(page), 1000));

await pipe(
  range(Infinity),
  toAsync,
  map(fetchApi), // 0,1,2,3,4,5
  filter((a) => a % 2 === 0),
  take(3), // 0,2,4
  concurrent(3),
  each(console.log), // 2 seconds
);
```

You can see that it takes 6 seconds when requesting one by one but takes 2 seconds when requesting using `concurrent`

A more practical code is below.

<iframe src="https://codesandbox.io/embed/fxts-concurrent-useful-0frg2?fontsize=14&hidenavigation=1&theme=dark"
     style={{height:800, width:"100%", border:0, borderRadius:4,overflow:"hidden"}}
     title="fxts-concurrent-useful"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe>
