const path = require("path");

module.exports = {
  target: ["web", "es5"],
  mode: "production",
  devtool: "source-map",
  entry: path.resolve(__dirname, "./src/index.ts"),
  optimization: {
    minimize: true,
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: {
          loader: "babel-loader",
        },
        exclude: /node_modules/,
        resolve: {
          fullySpecified: false,
          extensions: [".ts", ".js"],
        },
      },
    ],
  },
  output: {
    library: "_",
    libraryTarget: "umd",
    path: path.resolve(__dirname, "./dist"),
    filename: "fx.min.js",
  },
};
