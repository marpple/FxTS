import type { DefaultTheme } from "vitepress";

import functionData from "./function.json";

type FunctionData = Record<string, string[]>;

export function generateSidebar(): DefaultTheme.SidebarItem[] {
  const func = functionData as FunctionData;

  return [
    {
      text: "API Reference",
      link: "/api/",
    },
    ...Object.keys(func).map((category) => ({
      text: category,
      collapsed: false,
      items: func[category].map((name) => ({
        text: name,
        link: `/api/${name}`,
      })),
    })),
  ];
}
