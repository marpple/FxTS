import { defineConfig } from "vitepress";

import { generateSidebar } from "./sidebar";

export default defineConfig({
  lang: "en",
  title: "FxTS",
  description: "A functional library for TypeScript/JavaScript programmers.",

  head: [
    ["link", { rel: "icon", href: "/img/favicon.ico" }],
    [
      "script",
      {
        async: "",
        src: "https://www.googletagmanager.com/gtag/js?id=G-BTGRJYWTNK",
      },
    ],
    [
      "script",
      {},
      `window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-BTGRJYWTNK');`,
    ],
  ],

  themeConfig: {
    logo: "/img/fxts.png",
    siteTitle: "FxTS",

    nav: [
      { text: "Guide", link: "/guide/getting-started", activeMatch: "/guide/" },
      { text: "API", link: "/api/", activeMatch: "/api/" },
      { text: "GitHub", link: "https://github.com/marpple/fxts" },
    ],

    sidebar: {
      "/": [
        {
          text: "Getting Started",
          link: "/guide/getting-started",
        },
        {
          text: "Core Concepts",
          collapsed: false,
          items: [
            {
              text: "Function Composition",
              link: "/guide/function-composition",
            },
            { text: "Lazy Evaluation", link: "/guide/lazy-evaluation" },
            { text: "Handle Concurrency", link: "/guide/handle-concurrency" },
            { text: "Error Handling", link: "/guide/error-handling" },
            { text: "Method Chaining", link: "/guide/method-chaining" },
          ],
        },
        {
          text: "FAQ",
          collapsed: false,
          items: [
            { text: "When to use toAsync?", link: "/guide/to-async" },
            { text: "How to debug in pipeline?", link: "/guide/how-to-debug" },
          ],
        },
      ],
      "/api/": generateSidebar(),
    },

    footer: {
      message: "Released under the Apache-2.0 License.",
      copyright: `Copyright © ${new Date().getFullYear()} MARPPLE CORP.`,
    },

    search: {
      provider: "algolia",
      options: {
        appId: "0G39LGZ9QE",
        apiKey: "6234b2f489b3f43928034ab6c128f06c",
        indexName: "fxts",
      },
    },
  },
});
