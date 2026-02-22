<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { Moon, Sun } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/composables/useTheme";

const { theme, toggleTheme } = useTheme();
const isDark = computed(() => theme.value === "dark");
const { t } = useI18n();
</script>

<template>
  <Button
    data-testid="theme-toggle"
    :aria-label="t('header.toggleTheme')"
    variant="ghost"
    size="icon"
    @click="toggleTheme"
  >
    <Sun v-if="!isDark" class="icon-sm" />
    <Moon v-else class="icon-sm" />
  </Button>
</template>
