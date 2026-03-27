<script setup lang="ts">
import { useData } from "vitepress";
import { computed } from "vue";

const { frontmatter, lang } = useData();

const isUntranslated = computed(() => frontmatter.value.translated === false);

const messages: Record<string, { notice: string; cta: string }> = {
  ja: {
    notice: "このページはまだ翻訳されていません。英語の原文を表示しています。",
    cta: "翻訳に貢献する →",
  },
  "ko-KR": {
    notice:
      "이 페이지는 아직 번역되지 않았습니다. 영어 원문을 표시하고 있습니다.",
    cta: "번역에 기여하기 →",
  },
  "zh-CN": {
    notice: "此页面尚未翻译，正在显示英文原文。",
    cta: "参与翻译 →",
  },
};

const message = computed(() => {
  return messages[lang.value] ?? {
    notice: "This page has not been translated yet.",
    cta: "Help translate →",
  };
});

const contributeUrl = computed(() => {
  return "https://github.com/marpple/FxTS/issues?q=is%3Aopen+label%3Atranslation";
});
</script>

<template>
  <div v-if="isUntranslated" class="translation-banner">
    <p class="translation-banner-text">
      <span class="translation-banner-icon">⚠️</span>
      {{ message.notice }}
      <a :href="contributeUrl" target="_blank" rel="noopener noreferrer">
        {{ message.cta }}
      </a>
    </p>
  </div>
</template>

<style scoped>
.translation-banner {
  padding: 12px 20px;
  margin-bottom: 24px;
  border: 1px solid var(--vp-c-warning-2);
  border-radius: 8px;
  background-color: var(--vp-c-warning-soft);
}

.translation-banner-text {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: var(--vp-c-text-1);
}

.translation-banner-icon {
  margin-right: 4px;
}

.translation-banner a {
  color: var(--vp-c-brand-1);
  font-weight: 500;
  text-decoration: none;
  margin-left: 8px;
}

.translation-banner a:hover {
  text-decoration: underline;
}
</style>
