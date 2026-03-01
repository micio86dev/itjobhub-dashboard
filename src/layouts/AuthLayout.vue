<script setup lang="ts">
import { Briefcase } from 'lucide-vue-next'
import ThemeToggle from '@/components/layout/ThemeToggle.vue'
</script>

<template>
  <div class="auth-layout">
    <!-- Theme toggle -->
    <div class="auth-theme-toggle">
      <ThemeToggle />
    </div>

    <!-- Brand panel (hidden on mobile) -->
    <div class="brand-panel">
      <div class="brand-content">
        <div class="brand-logo-row">
          <div class="brand-icon-wrap">
            <Briefcase class="h-8 w-8" />
          </div>
          <div>
            <h1 class="brand-title">DevBoards</h1>
            <p class="brand-subtitle">Admin Panel</p>
          </div>
        </div>
        <p class="brand-tagline">{{ $t('auth.tagline') }}</p>
        <p class="brand-description">{{ $t('auth.brandDescription') }}</p>
      </div>
    </div>

    <!-- Form panel -->
    <div class="form-panel">
      <!-- Mobile logo -->
      <div class="mobile-logo">
        <Briefcase class="h-8 w-8 mobile-logo-icon" />
        <span class="mobile-logo-text">DevBoards</span>
      </div>

      <RouterView />
    </div>
  </div>
</template>

<style scoped>
.auth-layout {
  position: relative;
  display: flex;
  min-height: 100vh;
  background-color: var(--c-surface);
}

.auth-theme-toggle {
  position: absolute;
  right: 1rem;
  top: 1rem;
  z-index: 10;
}

/* ── Brand panel ── */
.brand-panel {
  display: none;
}

@media (min-width: 768px) {
  .brand-panel {
    display: flex;
    width: 50%;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: var(--c-primary);
    padding-inline: 2rem;
  }
}

.brand-content {
  max-width: 24rem;
  color: var(--c-text-inverted);
}

.brand-logo-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.brand-icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 1rem;
  background-color: rgb(255 255 255 / 0.2);
  color: white;
}

.brand-title {
  font-size: var(--text-3xl);
  font-weight: 700;
  color: var(--c-text-inverted);
}

.brand-subtitle {
  color: var(--color-green-100);
  font-size: var(--text-sm);
}

.brand-tagline {
  font-size: var(--text-xl);
  font-weight: 300;
  color: var(--color-green-50);
}

.brand-description {
  margin-top: 1rem;
  color: var(--color-green-100);
  opacity: 0.8;
  font-size: var(--text-sm);
}

/* ── Form panel ── */
.form-panel {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-inline: 1rem;
  padding-block: 4rem;
}

/* ── Mobile logo ── */
.mobile-logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

@media (min-width: 768px) {
  .mobile-logo {
    display: none;
  }
}

.mobile-logo-icon {
  color: var(--c-primary);
}

.mobile-logo-text {
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--c-text-base);
}
</style>
