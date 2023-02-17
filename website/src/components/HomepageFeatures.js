import useBaseUrl from "@docusaurus/useBaseUrl";
import CodeBlock from "@theme/CodeBlock";
import clsx from "clsx";
import React from "react";

import styles from "./HomepageFeatures.module.css";

const LazyFeature = () => {
  return (
    <div className="container">
      <div className={clsx("row", styles.titleSection)}>
        <div className="col col--4">
          <div className="container">
            <h1 className={clsx("hero__title", styles.title)}>
              Lazy evaluation
            </h1>
            <p className={clsx("hero__subtitle", styles.subtitle)}>
              Lazy evaluation is possible, It will consume
              "Iterable/asyncIterable" when it needs to be evaluated. so
              efficient calculation is attainable in declaratively written code.
            </p>
          </div>
        </div>
        <div className="col col--6 col--offset-2">
          <CodeBlock className="language-ts">
            {`pipe(
  [1, 2, 3, 4, 5],
  map(a => a + 10),
  filter(a => a % 2 === 0),
  take(2),
  toArray
); // [12, 14]`}
          </CodeBlock>
          <h2>Evaluation Order</h2>
          <img src={useBaseUrl("/img/lazy.gif")} />
        </div>
      </div>
    </div>
  );
};

const TypeInferenceFeature = () => {
  return (
    <div className="container">
      <div className={clsx("row", styles.titleSection)}>
        <div className="col col--4">
          <div className="container">
            <h1 className={clsx("hero__title", styles.title)}>
              Type Inference
            </h1>
            <p className={clsx("hero__subtitle", styles.subtitle)}>
              Easily infer composed functions, FxTS makes it simple for you to
              build complex logic through functional composition.
            </p>
          </div>
        </div>
        <div className="col col--6 col--offset-2">
          <img width="100%" src={useBaseUrl("/img/typeinfer.png")} />
        </div>
      </div>
    </div>
  );
};

const ConcurrentFeature = () => {
  return (
    <div className="container">
      <div className={clsx("row", styles.titleSection)}>
        <div className="col col--8">
          <iframe
            src="https://codesandbox.io/embed/fxts-concurrent-4x58c?fontsize=14&hidenavigation=1&expanddevtools=1"
            style={{
              width: "100%",
              height: 500,
              border: 0,
              borderRadius: 4,
              overflow: "hidden",
            }}
            title="serene-booth-be4ic"
            allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
            sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
          />
        </div>
        <div className="col col--4">
          <div className="container">
            <h1 className={clsx("hero__title", styles.title)}>Concurrent</h1>
            <p className={clsx("hero__subtitle", styles.subtitle)}>
              Simultaneous requests are possible, and concurrent situations can
              be created.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <LazyFeature />
      <ConcurrentFeature />
      <TypeInferenceFeature />
    </section>
  );
}
