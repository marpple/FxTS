---
id: handle-concurrency
---

# Handle Concurrency

It handles multiple asynchronous requests and also controls the count of requests

```ts
import {
  pipe,
  toAsync,
  delay,
  peek,
  range,
  map,
  filter,
  take,
} from "@fxts/core";

await pipe(
  toAsync(range(Infinity)),
  map((page) => delay(1000, page)), // 0,1,2,3,4,5
  filter((a) => a % 2 === 0),
  take(3), // 0,2,4
  concurrent(3),
  toArray, // 2 seconds
);
```

You can see that it takes 6 seconds when requesting one by one but takes 2 seconds when requesting using [concurrent](https://fxts.dev/docs/concurrent)

A more practical code is below.

<iframe src="https://codesandbox.io/embed/fxts-concurrent-useful-0frg2?fontsize=14&hidenavigation=1&theme=dark"
     style={{height:800, width:"100%", border:0, borderRadius:4,overflow:"hidden"}}
     title="fxts-concurrent-useful"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe>
