import type { DefaultTheme, LocaleSpecificConfig } from "vitepress";

import { generateSidebar } from "../sidebar";

export const jaConfig: LocaleSpecificConfig<DefaultTheme.Config> = {
  lang: "ja",
  themeConfig: {
    nav: [
      {
        text: "ガイド",
        link: "/ja/guide/getting-started",
        activeMatch: "/ja/guide/",
      },
      { text: "API", link: "/ja/api/", activeMatch: "/ja/api/" },
      { text: "GitHub", link: "https://github.com/marpple/fxts" },
    ],
    sidebar: {
      "/ja/": [
        {
          text: "はじめに",
          link: "/ja/guide/getting-started",
        },
        {
          text: "コアコンセプト",
          collapsed: false,
          items: [
            {
              text: "関数合成",
              link: "/ja/guide/function-composition",
            },
            { text: "遅延評価", link: "/ja/guide/lazy-evaluation" },
            { text: "並行処理", link: "/ja/guide/handle-concurrency" },
            { text: "エラー処理", link: "/ja/guide/error-handling" },
            { text: "メソッドチェーン", link: "/ja/guide/method-chaining" },
          ],
        },
        {
          text: "FAQ",
          collapsed: false,
          items: [
            {
              text: "toAsyncはいつ使うべきですか？",
              link: "/ja/guide/to-async",
            },
            {
              text: "パイプラインでのデバッグ方法",
              link: "/ja/guide/how-to-debug",
            },
          ],
        },
      ],
      "/ja/api/": generateSidebar("ja"),
    },
    outlineTitle: "ページ内容",
    docFooter: {
      prev: "前へ",
      next: "次へ",
    },
  },
};
