import { defineConfig } from "vitepress";

import { enConfig, jaConfig, koConfig, zhConfig } from "./locales";

export default defineConfig({
  title: "FxTS",
  description: "A functional library for TypeScript/JavaScript programmers.",
  cleanUrls: true,

  transformPageData(pageData) {
    const description =
      pageData.frontmatter.description ||
      "A functional library for TypeScript/JavaScript programmers.";
    const title = pageData.frontmatter.id
      ? `${pageData.frontmatter.id} - FxTS`
      : pageData.title || "FxTS";
    const ogImage = "https://fxts.dev/img/og_image.png";

    pageData.frontmatter.head = pageData.frontmatter.head || [];
    pageData.frontmatter.head.push(
      ["meta", { name: "description", content: description }],
      ["meta", { property: "og:title", content: title }],
      ["meta", { property: "og:description", content: description }],
      ["meta", { property: "og:type", content: "website" }],
      ["meta", { property: "og:image", content: ogImage }],
      ["meta", { name: "twitter:card", content: "summary_large_image" }],
      ["meta", { name: "twitter:title", content: title }],
      ["meta", { name: "twitter:description", content: description }],
      ["meta", { name: "twitter:image", content: ogImage }],
    );
  },

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
      label: "English",
    },
    ko: {
      ...koConfig,
      label: "한국어",
    },
    ja: {
      ...jaConfig,
      label: "日本語",
    },
    zh: {
      ...zhConfig,
      label: "中文",
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
        apiKey: "a1f403fee5358950f84bd6ad27867cd6",
        indexName: "fxts",
        locales: {
          root: {
            placeholder: "Search docs",
            translations: {
              button: {
                buttonText: "Search",
              },
            },
            searchParameters: {
              facetFilters: ["lang:en"],
            },
          },
          ko: {
            placeholder: "문서 검색",
            translations: {
              button: {
                buttonText: "검색",
              },
            },
            searchParameters: {
              facetFilters: ["lang:ko"],
            },
          },
          ja: {
            placeholder: "ドキュメント検索",
            translations: {
              button: {
                buttonText: "検索",
              },
            },
            searchParameters: {
              facetFilters: ["lang:ja"],
            },
          },
          zh: {
            placeholder: "搜索文档",
            translations: {
              button: {
                buttonText: "搜索",
              },
            },
            searchParameters: {
              facetFilters: ["lang:zh"],
            },
          },
        },
      },
    },
  },
});
