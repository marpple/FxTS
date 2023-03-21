// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "FxTS",
  tagline: "A functional library for TypeScript/JavaScript programmers.",
  url: "https://fxts.dev",
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",
  organizationName: "marpple", // Usually your GitHub org/user name.
  projectName: "FxTS", // Usually your repo name.
  themes: ["@docusaurus/theme-live-codeblock"],
  presets: [
    [
      "@docusaurus/preset-classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          // Please change this to your repo.
          // editUrl: "https://github.com/marpple/fxts/edit/main/website/",
        },
        // blog: {
        //   showReadingTime: true,
        //   // Please change this to your repo.
        //   editUrl:
        //     "https://github.com/facebook/docusaurus/edit/main/website/blog/",
        // },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: "FxTS",
        logo: {
          alt: "FxTS Logo",
          src: "img/fxts.png",
        },
        items: [
          { to: "/docs/getting-started", label: "Docs", position: "left" },
          { to: "/docs/index", label: "API", position: "left" },
          {
            href: "https://github.com/marpple/fxts",
            label: "GitHub",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Docs",
            items: [
              {
                label: "API",
                to: "/docs/index",
              },
            ],
          },
          {
            title: "More",
            items: [
              {
                label: "GitHub",
                href: "https://github.com/marpple/fxts",
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Marpple, Inc.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
      gtag: {
        trackingID: "G-BTGRJYWTNK",
        anonymizeIP: true,
      },
      algolia: {
        // The application ID provided by Algolia
        appId: "0G39LGZ9QE",

        // Public API key: it is safe to commit it
        apiKey: "6234b2f489b3f43928034ab6c128f06c",

        indexName: "fxts",

        // Optional: see doc section below
        // contextualSearch: true,

        // Optional: Specify domains where the navigation should occur through window.location instead on history.push. Useful when our Algolia config crawls multiple documentation sites and we want to navigate with window.location.href to them.
        // externalUrlRegex: "external\\.com|domain\\.com",

        // Optional: Algolia search parameters
        // searchParameters: {},

        // Optional: path for search page that enabled by default (`false` to disable it)
        // searchPagePath: "search",

        //... other Algolia params
      },
    }),
  clientModules: [require.resolve("./analytics.js")],
  scripts: [
    {
      src: "https://cdn.jsdelivr.net/npm/@fxts/core/dist/fx.min.js",
      async: true,
    },
  ],
};

module.exports = config;
