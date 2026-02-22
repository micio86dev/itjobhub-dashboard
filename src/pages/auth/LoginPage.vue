<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { z } from "zod";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { toast } from "vue-sonner";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/stores/auth.store";

const router = useRouter();
const { t } = useI18n();
const authStore = useAuthStore();
const showPassword = ref(false);
const shake = ref(false);

const loginSchema = z.object({
  email: z.string().email(t("auth.errors.email")),
  password: z.string().min(8, t("auth.errors.password")),
});

const { handleSubmit, defineField, errors, isSubmitting } = useForm({
  validationSchema: toTypedSchema(loginSchema),
});

const [email, emailAttrs] = defineField("email");
const [password, passwordAttrs] = defineField("password");

const hasError = computed(() => Boolean(authStore.error));

const onSubmit = handleSubmit(async (values) => {
  authStore.clearAuthError();
  try {
    await authStore.login(values.email, values.password);
    toast.success(t("auth.welcome", { name: authStore.userName || values.email }));
    router.push("/dashboard");
  } catch {
    shake.value = true;
    setTimeout(() => {
      shake.value = false;
    }, 450);
  }
});
</script>

<template>
  <Card class="border shadow-sm" :class="{ 'animate-shake': shake }">
    <CardHeader>
      <CardTitle class="card-title">{{ t("auth.title") }}</CardTitle>
    </CardHeader>
    <CardContent>
      <form class="form-section" @submit.prevent="onSubmit">
        <div class="form-group">
          <Label for="email" class="form-label">{{ t("auth.email") }}</Label>
          <div class="relative-wrapper">
            <Mail class="form-icon" />
            <Input
              id="email"
              v-model="email"
              v-bind="emailAttrs"
              data-testid="email"
              type="email"
              autocomplete="email"
              class="form-input form-input-with-icon"
            />
          </div>
          <p v-if="errors.email" class="form-error">{{ errors.email }}</p>
        </div>
        <div class="form-group">
          <Label for="password" class="form-label">{{ t("auth.password") }}</Label>
          <div class="relative-wrapper">
            <Lock class="form-icon" />
            <Input
              id="password"
              v-model="password"
              v-bind="passwordAttrs"
              data-testid="password"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="current-password"
              class="form-input form-input-with-toggle"
            />
            <button
              type="button"
              class="form-toggle-button"
              :aria-label="showPassword ? t('auth.hidePassword') : t('auth.showPassword')"
              @click="showPassword = !showPassword"
            >
              <Eye v-if="!showPassword" class="icon-sm" />
              <EyeOff v-else class="icon-sm" />
            </button>
          </div>
          <p v-if="errors.password" class="form-error">{{ errors.password }}</p>
        </div>
        <Button
          type="submit"
          class="btn-primary btn-primary-solid btn-primary-full-width"
          data-testid="login-btn"
        >
          <Loader2 v-if="isSubmitting" class="animate-spin-icon" />
          {{ t("auth.submit") }}
        </Button>
        <div v-if="hasError" data-testid="login-error" role="alert" class="form-error-box">
          {{ t("auth.errors.generic") }}
        </div>
        <a href="#" class="text-link">
          {{ t("auth.forgot") }}
        </a>
      </form>
    </CardContent>
  </Card>
</template>

<style scoped>
@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  20% {
    transform: translateX(-6px);
  }
  40% {
    transform: translateX(6px);
  }
  60% {
    transform: translateX(-4px);
  }
  80% {
    transform: translateX(4px);
  }
}

.animate-shake {
  animation: shake 0.45s ease-in-out;
}
</style>
