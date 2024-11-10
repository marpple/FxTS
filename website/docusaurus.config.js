// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const { themes } = require("prism-react-renderer");
const lightCodeTheme = themes.github;
const darkCodeTheme = themes.dracula;

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "FxTS",
  tagline: "A functional library for TypeScript/JavaScript programmers.",
  url: "https://fxts.dev",
  baseUrl: "/",
  onBrokenLinks: "ignore",
  onBrokenMarkdownLinks: "ignore",
  favicon: "img/favicon.ico",
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },
  organizationName: "marpple", // Usually your GitHub org/user name.
  projectName: "FxTS", // Usually your repo name.
  themes: ["@docusaurus/theme-live-codeblock"],
  presets: [
    [
      "@docusaurus/preset-classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      {
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
        gtag: {
          trackingID: "G-BTGRJYWTNK",
          anonymizeIP: true,
        },
      },
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
          {
            to: "/docs/getting-started",
            label: "Docs",
            position: "left",
            type: "doc",
            docId: "getting-started",
          },
          {
            to: "/docs",
            label: "API",
            position: "left",
            type: "doc",
            docId: "index",
          },
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
                to: "/docs",
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
        copyright: `<div>Copyright © ${new Date().getFullYear()} <a href="https://www.marpplecorp.com/">MARPPLE CORP.</a></div>`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
      algolia: {
        // The application ID provided by Algolia
        appId: "0G39LGZ9QE",

        // Public API key: it is safe to commit it
        apiKey: "6234b2f489b3f43928034ab6c128f06c",

        indexName: "fxts",
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
