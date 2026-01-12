import type { DefaultTheme, LocaleSpecificConfig } from "vitepress";

import { generateSidebar } from "../sidebar";

export const zhConfig: LocaleSpecificConfig<DefaultTheme.Config> = {
  lang: "zh",
  themeConfig: {
    nav: [
      {
        text: "指南",
        link: "/zh/guide/getting-started",
        activeMatch: "/zh/guide/",
      },
      { text: "API", link: "/zh/api/", activeMatch: "/zh/api/" },
      { text: "GitHub", link: "https://github.com/marpple/fxts" },
    ],
    sidebar: {
      "/zh/": [
        {
          text: "快速开始",
          link: "/zh/guide/getting-started",
        },
        {
          text: "核心概念",
          collapsed: false,
          items: [
            {
              text: "函数组合",
              link: "/zh/guide/function-composition",
            },
            { text: "惰性求值", link: "/zh/guide/lazy-evaluation" },
            { text: "并发处理", link: "/zh/guide/handle-concurrency" },
            { text: "错误处理", link: "/zh/guide/error-handling" },
            { text: "方法链", link: "/zh/guide/method-chaining" },
          ],
        },
        {
          text: "FAQ",
          collapsed: false,
          items: [
            { text: "何时使用toAsync？", link: "/zh/guide/to-async" },
            {
              text: "如何在管道中调试？",
              link: "/zh/guide/how-to-debug",
            },
          ],
        },
      ],
      "/zh/api/": generateSidebar("zh"),
    },
    outlineTitle: "页面内容",
    docFooter: {
      prev: "上一页",
      next: "下一页",
    },
  },
};
