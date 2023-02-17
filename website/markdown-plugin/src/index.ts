import { IApiDocumenterPluginManifest } from "@microsoft/api-documenter";

import MarkdownFeature from "./MarkdownFeature";

export const apiDocumenterPluginManifest: IApiDocumenterPluginManifest = {
  manifestVersion: 1000,
  features: [
    {
      featureName: "markdown-documenter",
      kind: "MarkdownDocumenterFeature",
      subclass: MarkdownFeature,
    },
  ],
};
