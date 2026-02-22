<script setup lang="ts">
import ThemeToggle from "@/components/layout/ThemeToggle.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
</script>

<template>
  <div class="auth-layout" data-testid="auth-layout">
    <div class="auth-theme-toggle">
      <ThemeToggle />
    </div>
    <div class="auth-grid">
      <section class="auth-brand-panel" data-testid="brand-section">
        <div class="auth-brand-content">
          <h1 class="auth-brand-title">{{ t("app.name") }}</h1>
          <p class="auth-brand-tagline">{{ t("app.tagline") }}</p>
        </div>
      </section>
      <section class="auth-form-panel" data-testid="form-section">
        <div class="auth-form-wrapper">
          <slot />
        </div>
      </section>
    </div>
  </div>
</template>
