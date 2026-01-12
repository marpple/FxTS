import type { DefaultTheme, LocaleSpecificConfig } from "vitepress";

import { generateSidebar } from "../sidebar";

export const koConfig: LocaleSpecificConfig<DefaultTheme.Config> = {
  lang: "ko",
  themeConfig: {
    nav: [
      {
        text: "가이드",
        link: "/ko/guide/getting-started",
        activeMatch: "/ko/guide/",
      },
      { text: "API", link: "/ko/api/", activeMatch: "/ko/api/" },
      { text: "GitHub", link: "https://github.com/marpple/fxts" },
    ],
    sidebar: {
      "/ko/": [
        {
          text: "시작하기",
          link: "/ko/guide/getting-started",
        },
        {
          text: "핵심 개념",
          collapsed: false,
          items: [
            {
              text: "함수 합성",
              link: "/ko/guide/function-composition",
            },
            { text: "지연 평가", link: "/ko/guide/lazy-evaluation" },
            { text: "동시성 처리", link: "/ko/guide/handle-concurrency" },
            { text: "에러 처리", link: "/ko/guide/error-handling" },
            { text: "메서드 체이닝", link: "/ko/guide/method-chaining" },
          ],
        },
        {
          text: "FAQ",
          collapsed: false,
          items: [
            { text: "toAsync는 언제 사용하나요?", link: "/ko/guide/to-async" },
            {
              text: "파이프라인에서 디버깅하는 방법",
              link: "/ko/guide/how-to-debug",
            },
          ],
        },
      ],
      "/ko/api/": generateSidebar("ko"),
    },
    outlineTitle: "페이지 내용",
    docFooter: {
      prev: "이전",
      next: "다음",
    },
  },
};
