import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import * as fx from "@fxts/core";
import Layout from "@theme/Layout";
import clsx from "clsx";
import React from "react";

import HomepageFeatures from "../components/HomepageFeatures";
import styles from "./index.module.css";

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();

  React.useEffect(() => {
    console.log(
      "%cHello FxTS!\n%cExperience the FxTS functions through `window.fx` in your current console.",
      "color: #8f52fa; font-weight: bold; font-size: 36px;",
      "color: gray; font-size: 16px;",
    );
    window.fx = fx;
  }, []);

  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <div className={styles.button}>
            <Link
              className="button button--secondary button--lg"
              to="/docs/getting-started"
            >
              GETTING STARTED
            </Link>
          </div>
          <div className={styles.button}>
            <Link className="button button--secondary button--lg" to="/docs">
              API DOCS
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  // const { siteConfig } = useDocusaurusContext();
  return (
    <Layout>
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
