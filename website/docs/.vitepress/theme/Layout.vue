<script setup lang="ts">
import DefaultTheme from "vitepress/theme";
import TranslationBanner from "./TranslationBanner.vue";

const { Layout } = DefaultTheme;
</script>

<template>
  <Layout>
    <template #doc-before>
      <TranslationBanner />
    </template>
  </Layout>
</template>
