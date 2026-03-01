<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

interface Props {
    isOpen?: unknown // Accept any truthy/falsy value
    title: string
    message: string
    confirmText?: string
    cancelText?: string
    variant?: 'danger' | 'warning' | 'info'
}

const props = withDefaults(defineProps<Props>(), {
    variant: 'danger',
})

const emit = defineEmits<{
    confirm: []
    cancel: []
    'update:isOpen': [value: null]
}>()

const { t } = useI18n()

// Convert any truthy/falsy value to boolean for template rendering
const isDialogOpen = computed(() => !!props.isOpen)

const handleCancel = () => {
    emit('update:isOpen', null)
    emit('cancel')
}

const handleConfirm = () => {
    emit('confirm')
    emit('update:isOpen', null)
}

const handleOverlayClick = () => {
    handleCancel()
}
</script>

<template>
    <Teleport to="body">
        <Transition name="dialog-fade">
            <div v-if="isDialogOpen" class="overlay" @click.self="handleOverlayClick">
                <div class="dialog" :class="`dialog-${variant}`">
                    <h3 class="dialog-title">{{ title }}</h3>
                    <p class="dialog-body">{{ message }}</p>
                    <div class="dialog-footer">
                        <button class="btn-ghost" @click="handleCancel">
                            {{ cancelText || t('common.cancel') }}
                        </button>
                        <button :class="variant === 'danger' ? 'btn-danger' : 'btn-primary'" @click="handleConfirm">
                            {{ confirmText || t('common.delete') }}
                        </button>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<style scoped>
.overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    backdrop-filter: blur(2px);
}

.dialog {
    background: var(--bg-secondary, #fff);
    border-radius: 8px;
    padding: 24px;
    max-width: 480px;
    width: 90%;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    animation: dialog-enter 0.2s ease-out;
}

@keyframes dialog-enter {
    from {
        opacity: 0;
        transform: scale(0.95) translateY(-10px);
    }

    to {
        opacity: 1;
        transform: scale(1) translateY(0);
    }
}

.dialog-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0 0 12px 0;
    color: var(--text-primary, #1a1a1a);
}

.dialog-body {
    margin: 0 0 24px 0;
    color: var(--text-secondary, #666);
    line-height: 1.5;
}

.dialog-footer {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
}

.btn-ghost,
.btn-danger,
.btn-primary {
    padding: 8px 16px;
    border-radius: 6px;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s ease;
    border: none;
}

.btn-ghost {
    background: transparent;
    color: var(--text-secondary, #666);
}

.btn-ghost:hover {
    background: var(--bg-tertiary, #f5f5f5);
    color: var(--text-primary, #1a1a1a);
}

.btn-danger {
    background: #dc2626;
    color: white;
}

.btn-danger:hover {
    background: #b91c1c;
}

.btn-primary {
    background: var(--color-primary, #3b82f6);
    color: white;
}

.btn-primary:hover {
    background: var(--color-primary-dark, #2563eb);
}

/* Transitions */
.dialog-fade-enter-active,
.dialog-fade-leave-active {
    transition: opacity 0.2s ease;
}

.dialog-fade-enter-from,
.dialog-fade-leave-to {
    opacity: 0;
}

.dialog-fade-enter-active .dialog {
    animation: dialog-enter 0.2s ease-out;
}

.dialog-fade-leave-active .dialog {
    animation: dialog-enter 0.2s ease-out reverse;
}
</style>
