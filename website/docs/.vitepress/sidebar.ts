import type { DefaultTheme } from "vitepress";

import functionData from "./function.json";

type FunctionData = Record<string, string[]>;

export function generateSidebar(
  locale: string = "",
): DefaultTheme.SidebarItem[] {
  const func = functionData as FunctionData;
  const prefix = locale ? `/${locale}` : "";

  return [
    {
      text: "API Reference",
      link: `${prefix}/api/`,
    },
    ...Object.keys(func).map((category) => ({
      text: category,
      collapsed: false,
      items: func[category].map((name) => ({
        text: name,
        link: `${prefix}/api/${name}`,
      })),
    })),
  ];
}
