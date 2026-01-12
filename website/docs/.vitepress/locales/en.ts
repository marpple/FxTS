import type { DefaultTheme, LocaleSpecificConfig } from "vitepress";

import { generateSidebar } from "../sidebar";

export const enConfig: LocaleSpecificConfig<DefaultTheme.Config> = {
  lang: "en",
  themeConfig: {
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
  },
};
