module.exports = (api) => {
  api.cache(true);
  const targets = { ie: 11 };

  const plugins = [
    [
      "@babel/plugin-transform-runtime",
      {
        corejs: 3,
      },
    ],
  ];

  return {
    presets: [
      [
        "@babel/preset-typescript",
        {
          onlyRemoveTypeImports: true,
        },
      ],
      [
        "@babel/preset-env",
        {
          targets,
        },
      ],
    ],
    plugins,
    comments: false,
    sourceMaps: true,
  };
};
