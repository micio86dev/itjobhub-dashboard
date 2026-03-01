<script setup lang="ts">
import { shallowRef } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useForm, useField } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth.store'

const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()

const loginSchema = z.object({
  email: z.string().email(t('auth.emailInvalid')),
  password: z.string().min(8, t('auth.passwordMin')),
})

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: toTypedSchema(loginSchema),
})

const { value: email, errorMessage: emailError } = useField<string>('email')
const { value: password, errorMessage: passwordError } = useField<string>('password')

const showPassword = shallowRef(false)
const submitError = shallowRef<string | null>(null)

const onSubmit = handleSubmit(async (values) => {
  submitError.value = null
  try {
    await authStore.login(values.email, values.password)
    await router.push('/dashboard')
  } catch (e: unknown) {
    submitError.value = e instanceof Error ? e.message : t('auth.loginError')
  }
})
</script>

<template>
  <div class="login-wrapper">
    <div class="card login-card">
      <div class="login-heading">
        <h1 class="page-title">{{ $t('auth.loginTitle') }}</h1>
        <p class="login-subtitle">{{ $t('auth.panelSubtitle') }}</p>
      </div>

      <form @submit="onSubmit" novalidate>

        <!-- Email field -->
        <div class="form-field">
          <label class="form-label">{{ $t('auth.email') }}</label>
          <div class="field-icon-wrap">
            <Mail class="field-icon h-4 w-4" />
            <input
              v-model="email"
              data-testid="email"
              type="email"
              :placeholder="$t('auth.emailPlaceholder')"
              class="form-input form-input-icon-left"
              :class="{ 'is-error': emailError }"
            />
          </div>
          <p v-if="emailError" class="form-error">{{ emailError }}</p>
        </div>

        <!-- Password field -->
        <div class="form-field-last">
          <label class="form-label">{{ $t('auth.password') }}</label>
          <div class="field-icon-wrap">
            <Lock class="field-icon h-4 w-4" />
            <input
              v-model="password"
              data-testid="password"
              :type="showPassword ? 'text' : 'password'"
              :placeholder="$t('auth.passwordPlaceholder')"
              class="form-input form-input-icon-left form-input-icon-right"
              :class="{ 'is-error': passwordError }"
            />
            <button type="button" class="field-icon-right" @click="showPassword = !showPassword">
              <Eye v-if="!showPassword" class="h-4 w-4" />
              <EyeOff v-else class="h-4 w-4" />
            </button>
          </div>
          <p v-if="passwordError" class="form-error">{{ passwordError }}</p>
        </div>

        <!-- Submit error -->
        <div
          v-if="submitError"
          data-testid="login-error"
          class="form-error-box"
        >
          {{ submitError }}
        </div>

        <!-- Submit button -->
        <button
          data-testid="login-btn"
          type="submit"
          :disabled="isSubmitting"
          class="btn-primary login-submit"
        >
          <Loader2 v-if="isSubmitting" class="h-4 w-4 animate-spin" />
          {{ $t('auth.login') }}
        </button>

        <!-- Forgot password -->
        <p class="forgot-wrap">
          <a href="#" class="forgot-link">{{ $t('auth.forgotPassword') }}</a>
        </p>

      </form>
    </div>
  </div>
</template>

<style scoped>
.login-wrapper {
  width: 100%;
  max-width: 28rem;
}

.login-card {
  padding: var(--sp-8);
}

.login-heading {
  margin-bottom: var(--sp-8);
}

.login-subtitle {
  margin-top: var(--sp-1);
  font-size: var(--text-sm);
  color: var(--c-text-muted);
}

.login-submit {
  width: 100%;
  justify-content: center;
  padding-block: var(--sp-2\.5);
}

.forgot-wrap {
  margin-top: var(--sp-4);
  text-align: center;
}

.forgot-link {
  font-size: var(--text-sm);
  color: var(--c-primary-text);
  text-decoration: none;

  &:hover { text-decoration: underline; }
}
</style>
