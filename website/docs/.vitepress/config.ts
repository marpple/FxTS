import { defineConfig } from "vitepress";

import { enConfig, jaConfig, koConfig, zhConfig } from "./locales";

export default defineConfig({
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

  locales: {
    root: {
      ...enConfig,
    },
    ko: {
      ...koConfig,
    },
    ja: {
      ...jaConfig,
    },
    zh: {
      ...zhConfig,
    },
  },

  themeConfig: {
    logo: "/img/fxts.png",
    siteTitle: "FxTS",

    footer: {
      message: "Released under the Apache-2.0 License.",
      copyright: `Copyright © ${new Date().getFullYear()} <a href="https://www.marpplecorp.com/">MARPPLE CORP.</a>`,
    },

    search: {
      provider: "algolia",
      options: {
        appId: "0G39LGZ9QE",
        apiKey: "6234b2f489b3f43928034ab6c128f06c",
        indexName: "fxts",
        locales: {
          root: {
            placeholder: "Search docs",
            translations: {
              button: {
                buttonText: "Search",
              },
            },
          },
          ko: {
            placeholder: "문서 검색",
            translations: {
              button: {
                buttonText: "검색",
              },
            },
          },
          ja: {
            placeholder: "ドキュメント検索",
            translations: {
              button: {
                buttonText: "検索",
              },
            },
          },
          zh: {
            placeholder: "搜索文档",
            translations: {
              button: {
                buttonText: "搜索",
              },
            },
          },
        },
      },
    },
  },
});
