<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { Button } from "@/components/ui/button";

const { t } = useI18n();
</script>

<template>
  <div class="not-found-container" data-testid="not-found-page">
    <h2 class="page-title">{{ t("notFound.title") }}</h2>
    <Button variant="outline" @click="$router.push('/dashboard')">
      {{ t("notFound.back") }}
    </Button>
  </div>
</template>
