<script setup lang="ts">
import { computed } from "vue";
import { RouterView, useRoute } from "vue-router";
import { Toaster } from "@/components/ui/sonner";
import AuthLayout from "@/layouts/AuthLayout.vue";
import DashboardLayout from "@/layouts/DashboardLayout.vue";

const route = useRoute();
const layout = computed(() => route.meta.layout ?? "empty");
</script>

<template>
  <Toaster />
  <AuthLayout v-if="layout === 'auth'">
    <RouterView />
  </AuthLayout>
  <DashboardLayout v-else-if="layout === 'dashboard'">
    <RouterView />
  </DashboardLayout>
  <RouterView v-else />
</template>
