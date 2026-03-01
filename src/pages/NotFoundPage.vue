<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<template>
  <div class="not-found">
    <p class="error-code">404</p>
    <h1 class="error-title">{{ $t('errors.notFound') }}</h1>
    <p class="error-desc">{{ $t('errors.notFoundDesc') }}</p>
    <button class="btn-primary back-btn" @click="router.push('/')">
      {{ $t('errors.backHome') }}
    </button>
  </div>
</template>

<style scoped>
.not-found {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: var(--c-surface);
  padding-inline: 1rem;
}

.error-code {
  font-size: var(--text-8xl);
  font-weight: 900;
  color: var(--c-surface-raised);
  line-height: 1;
}

.error-title {
  margin-top: 1rem;
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--c-text-base);
}

.error-desc {
  margin-top: 0.5rem;
  color: var(--c-text-muted);
}

.back-btn {
  margin-top: 1.5rem;
  padding-inline: 1.25rem;
}
</style>
