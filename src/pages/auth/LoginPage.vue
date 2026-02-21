<template>
  <AuthLayout>
    <div class="w-full max-w-md">
    <Card class="shadow-lg border-border" :class="{ 'animate-shake': shakeForm }">
      <CardHeader class="space-y-1 mb-4 text-center">
        <CardTitle class="font-bold text-3xl tracking-tight">Accesso Admin</CardTitle>
        <CardDescription>
          Inserisci email e password per accedere al pannello di amministrazione
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form @submit="onSubmit" class="space-y-4">
          <!-- TODO: Expand on shadcn form items (FormField, FormItem, FormControl, FormMessage) -->
          <FormField v-slot="{ componentField }" name="email">
            <FormItem>
              <div class="relative">
                <Mail class="top-3 left-3 absolute w-5 h-5 text-muted-foreground" />
                <FormControl>
                  <Input 
                    type="email" 
                    placeholder="admin@example.com" 
                    v-bind="componentField" 
                    class="pl-10"
                    data-testid="email"
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="password">
            <FormItem>
              <div class="relative">
                <Lock class="top-3 left-3 absolute w-5 h-5 text-muted-foreground" />
                <FormControl>
                  <Input 
                    :type="showPassword ? 'text' : 'password'" 
                    placeholder="••••••••" 
                    v-bind="componentField" 
                    class="pr-10 pl-10"
                    data-testid="password"
                  />
                </FormControl>
                <div 
                  class="top-3 right-3 absolute text-muted-foreground hover:text-foreground cursor-pointer"
                  @click="showPassword = !showPassword"
                >
                  <Eye v-if="!showPassword" class="w-5 h-5" />
                  <EyeOff v-else class="w-5 h-5" />
                </div>
              </div>
              <FormMessage />
            </FormItem>
          </FormField>

          <div v-if="authStore.error" class="flex items-center gap-2 bg-destructive/10 p-3 rounded-md text-destructive text-sm" data-testid="login-error">
            <AlertCircle class="w-4 h-4" />
            <span class="font-medium">{{ authStore.error }}</span>
          </div>

          <Button 
            type="submit" 
            class="bg-[#22c55e] hover:bg-[#16a34a] focus:ring-[#22c55e] w-full text-white" 
            :disabled="authStore.loading"
            data-testid="login-btn"
          >
            <Loader2 v-if="authStore.loading" class="mr-2 w-4 h-4 animate-spin" />
            <span v-else>Accedi</span>
          </Button>
          
          <div class="mt-4 text-sm text-center">
            <a href="#" class="text-muted-foreground hover:text-foreground underline underline-offset-4">
              Password dimenticata?
            </a>
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
  </AuthLayout>
</template>

<script setup lang="ts">
import AuthLayout from '@/layouts/AuthLayout.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { useAuthStore } from '@/stores/auth.store'
import { useToast } from '@/components/ui/toast/use-toast'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form'
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()
const { toast } = useToast()

const showPassword = ref(false)
const shakeForm = ref(false)

const loginSchema = z.object({
  email: z.string().min(1, 'L\'email è obbligatoria').email('Email non valida'),
  password: z.string().min(8, 'Almeno 8 caratteri')
})

const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(loginSchema),
  initialValues: {
    email: '',
    password: ''
  }
})

const triggerShake = () => {
  shakeForm.value = false
  setTimeout(() => {
    shakeForm.value = true
  }, 50)
}

const onSubmit = handleSubmit(async (values) => {
  try {
    await authStore.login(values.email, values.password)
    toast({
      title: 'Successo',
      description: `Benvenuto, ${authStore.userName}`,
      variant: 'default',
    })
    router.push('/dashboard')
  } catch (e) {
    triggerShake()
  }
})
</script>

<style>
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
  20%, 40%, 60%, 80% { transform: translateX(4px); }
}

.animate-shake {
  animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
}
</style>
