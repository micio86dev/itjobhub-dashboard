<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useQuery } from '@tanstack/vue-query'
import { formatDistanceToNow, type Locale } from 'date-fns'
import { it } from 'date-fns/locale/it'
import { enUS as en } from 'date-fns/locale/en-US'
import { es } from 'date-fns/locale/es'
import { de } from 'date-fns/locale/de'
import { fr } from 'date-fns/locale/fr'
import type { ColumnDef } from '@tanstack/vue-table'
import DataTable from '@/components/organisms/DataTable.vue'
import ConfirmDialog from '@/components/organisms/ConfirmDialog.vue'
import { getContacts, replyToContact, updateReply, deleteReply, type Contact, type ContactReply } from '@/api/messages'
import { useUnreadMessages } from '@/composables/useUnreadMessages'
import '@/assets/css/components/messages.css'

const { t, locale } = useI18n()
const { refetch: refetchUnreadCount } = useUnreadMessages()

const page = ref(1)
const limit = ref(10)
const selectedContact = ref<Contact | null>(null)
const replyMessage = ref('')
const isReplying = ref(false)
const showReplyForm = ref(false)
const editingReplyId = ref<string | null>(null)
const editingReplyText = ref('')
const isEditingSaving = ref(false)
const isDeletingReplyId = ref<string | null>(null)
const confirmDeleteReplyId = ref<string | null>(null)

// Get locale for date-fns
const getDateLocale = (): Locale => {
  const localeMap: Record<string, Locale> = { it, en, es, de, fr }
  return localeMap[locale.value] || en
}

const queryParams = computed(() => ({
  page: page.value,
  limit: limit.value,
}))

const contactsQ = useQuery({
  queryKey: ['contacts', page, limit],
  queryFn: () => getContacts(queryParams.value),
  staleTime: 0,
  gcTime: 0,
  refetchOnMount: true,
  refetchOnWindowFocus: false,
  select: (response: unknown) => {
    const payload = response as {
      data?: Contact[] | { data?: Contact[]; pagination?: { page: number; limit: number; total: number; pages: number } }
      pagination?: { page: number; limit: number; total: number; pages: number }
    }

    const data = Array.isArray(payload.data)
      ? payload.data
      : (payload.data?.data ?? [])

    const nestedPagination = !Array.isArray(payload.data)
      ? payload.data?.pagination
      : undefined
    const pagination = payload.pagination ?? nestedPagination

    return { data, pagination }
  },
})

const columns: ColumnDef<Contact>[] = [
  {
    id: 'sender',
    accessorFn: (r) =>
      r.is_sender_logged_in && r.user
        ? `${r.user.first_name} ${r.user.last_name}`
        : r.sender_name,
    header: t('messages.from'),
  },
  {
    id: 'email',
    accessorKey: 'sender_email',
    header: t('messages.email'),
  },
  {
    id: 'subject',
    accessorFn: (r) => {
      // Translate if it's a predefined type key
      if (['general', 'error', 'participation', 'other'].includes(r.subject)) {
        return t(`contact.type.${r.subject}`)
      }
      return r.subject
    },
    header: t('messages.subject'),
  },
  {
    id: 'date',
    accessorFn: (r) => {
      try {
        return formatDistanceToNow(new Date(String(r.created_at)), {
          addSuffix: true,
          locale: getDateLocale(),
        })
      } catch {
        return '-'
      }
    },
    header: t('messages.date'),
  },
  {
    id: 'replies',
    accessorFn: (r) => {
      return r.replies.length > 0 ? t('messages.answered') : t('messages.pending')
    },
    header: t('messages.status'),
  },
  {
    id: 'userStatus',
    accessorFn: (r) => (r.is_sender_logged_in ? t('messages.registeredUser') : t('messages.anonymous')),
    header: t('messages.userType'),
  },
]

const handleSelectContact = async (contact: Contact) => {
  // Refetch data to get latest state
  await contactsQ.refetch()

  // Find the updated contact from fresh data
  const updatedContact = contactsQ.data.value?.data.find(c => c.id === contact.id)
  selectedContact.value = updatedContact || contact

  replyMessage.value = ''
  showReplyForm.value = false
}

const handleSendReply = async () => {
  if (!selectedContact.value || !replyMessage.value.trim()) return

  const contactId = selectedContact.value.id
  isReplying.value = true
  try {
    await replyToContact(contactId, {
      message: replyMessage.value,
    })

    replyMessage.value = ''
    showReplyForm.value = false

    // Refetch to get updated data
    await contactsQ.refetch()

    // Update selectedContact with fresh data
    const updatedContact = contactsQ.data.value?.data.find(c => c.id === contactId)
    if (updatedContact) {
      selectedContact.value = updatedContact
    }

    // Refetch the unread count
    await refetchUnreadCount()
  } catch (error) {
    console.error('Error sending reply:', error)
  } finally {
    isReplying.value = false
  }
}

const handleCloseDetail = () => {
  selectedContact.value = null
  replyMessage.value = ''
  showReplyForm.value = false
}

/**
 * Start editing a reply
 */
const handleEditReply = (reply: ContactReply) => {
  editingReplyId.value = reply.id
  editingReplyText.value = reply.message
}

/**
 * Cancel editing a reply
 */
const handleCancelEdit = () => {
  editingReplyId.value = null
  editingReplyText.value = ''
}

/**
 * Save edited reply
 */
const handleSaveEditReply = async () => {
  if (!selectedContact.value || !editingReplyId.value || !editingReplyText.value.trim()) return

  const contactId = selectedContact.value.id
  isEditingSaving.value = true
  try {
    await updateReply(contactId, editingReplyId.value, {
      message: editingReplyText.value
    })

    editingReplyId.value = null
    editingReplyText.value = ''

    // Refetch to get updated data
    await contactsQ.refetch()

    // Update selectedContact with fresh data
    const updatedContact = contactsQ.data.value?.data.find(c => c.id === contactId)
    if (updatedContact) {
      selectedContact.value = updatedContact
    }
  } catch {
    // Error handled silently
  } finally {
    isEditingSaving.value = false
  }
}

/**
 * Delete a reply
 */
const handleDeleteReply = async () => {
  if (!selectedContact.value || !confirmDeleteReplyId.value) return

  const contactId = selectedContact.value.id
  const replyId = confirmDeleteReplyId.value
  isDeletingReplyId.value = replyId
  try {
    await deleteReply(contactId, replyId)

    // Refetch to get updated data
    await contactsQ.refetch()

    // Update selectedContact with fresh data
    const updatedContact = contactsQ.data.value?.data.find(c => c.id === contactId)
    if (updatedContact) {
      selectedContact.value = updatedContact
    }
  } catch {
    // Error handled silently
  } finally {
    isDeletingReplyId.value = null
    confirmDeleteReplyId.value = null
  }
}
</script>

<template>
  <div class="page-stack">
    <!-- Header -->
    <div class="page-header-row">
      <div class="page-title-group">
        <h1 class="page-title">{{ $t('messages.title') }}</h1>
        <span v-if="contactsQ.data.value" class="badge">
          {{ contactsQ.data.value.pagination?.total ?? 0 }}
        </span>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="content-wrapper">
      <!-- Contacts List -->
      <div class="contacts-list-section">
        <div v-if="contactsQ.isError.value" class="error-box">
          {{ (contactsQ.error.value as Error)?.message || $t('messages.errorLoading') }}
        </div>

        <DataTable :columns="columns" :data="contactsQ.data.value?.data ?? []" :loading="contactsQ.isPending.value"
          :searchable="false" @row-click="(row: Contact) => handleSelectContact(row)" />

        <!-- Pagination -->
        <div v-if="contactsQ.data.value?.pagination" class="pagination-controls">
          <button :disabled="page <= 1" @click="page--" class="btn-pagination">
            {{ $t('table.prev') }}
          </button>
          <span class="pagination-info">
            {{ $t('table.page') }} {{ page }} / {{ contactsQ.data.value?.pagination?.pages ?? 1 }}
          </span>
          <button :disabled="page >= (contactsQ.data.value?.pagination?.pages ?? 1)" @click="page++"
            class="btn-pagination">
            {{ $t('table.next') }}
          </button>
        </div>
      </div>

      <!-- Contact Detail Panel -->
      <div v-if="selectedContact" class="contact-detail-panel">
        <div class="detail-header">
          <button @click="handleCloseDetail" class="btn-close">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h2 class="detail-title">
            {{ ['general', 'error', 'participation', 'other'].includes(selectedContact.subject)
              ? $t(`contact.type.${selectedContact.subject}`)
              : selectedContact.subject }}
          </h2>
        </div>

        <div class="detail-content">
          <!-- Sender Info -->
          <div class="sender-info">
            <p><strong>{{ $t('messages.from') }}:</strong> {{ selectedContact.sender_name }}</p>
            <p><strong>{{ $t('messages.email') }}:</strong> {{ selectedContact.sender_email }}</p>
            <p>
              <strong>{{ $t('messages.status') }}:</strong>
              <span class="badge-status">
                {{
                  selectedContact.is_sender_logged_in
                    ? $t('messages.registeredUser')
                    : $t('messages.anonymous')
                }}
              </span>
            </p>
            <p>
              <strong>{{ $t('messages.date') }}:</strong>
              {{ formatDistanceToNow(new Date(selectedContact.created_at), {
                addSuffix: true, locale:
                  getDateLocale()
              }) }}
            </p>
          </div>

          <!-- Original Message -->
          <div class="message-box">
            <h3 class="message-label">{{ $t('messages.originalMessage') }}</h3>
            <p class="message-content">{{ selectedContact.message }}</p>
          </div>

          <!-- Replies Thread -->
          <div v-if="selectedContact.replies.length > 0" class="replies-thread">
            <div class="replies-header">
              <h3 class="replies-title">{{ $t('messages.replies') }} ({{ selectedContact.replies.length
              }})
              </h3>
            </div>
            <div class="reply-item" v-for="reply in selectedContact.replies" :key="reply.id">
              <!-- Editing Form -->
              <div v-if="editingReplyId === reply.id" class="reply-edit-form">
                <textarea v-model="editingReplyText" class="reply-textarea" rows="4"></textarea>
                <div class="form-actions">
                  <button @click="handleSaveEditReply" :disabled="isEditingSaving || !editingReplyText.trim()"
                    class="btn-send">
                    {{ isEditingSaving ? $t('common.saving') : $t('common.save') }}
                  </button>
                  <button @click="handleCancelEdit" class="btn-cancel" :disabled="isEditingSaving">
                    {{ $t('common.cancel') }}
                  </button>
                </div>
              </div>

              <!-- Reply Display -->
              <div v-else class="reply-display">
                <div class="reply-header">
                  <div class="reply-sender">
                    <span v-if="reply.replier" class="reply-admin-name">
                      {{ reply.replier.first_name }} {{ reply.replier.last_name }}
                    </span>
                    <span v-else class="reply-admin-name">Admin</span>
                  </div>
                  <div class="reply-actions">
                    <button @click="handleEditReply(reply)" class="btn-icon-action" title="Edit">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button @click="confirmDeleteReplyId = reply.id" :disabled="isDeletingReplyId === reply.id"
                      class="btn-icon-action btn-danger" title="Delete">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  <span class="reply-status">
                    <span v-if="reply.read_by_sender" class="badge-read">{{ $t('messages.read')
                    }}</span>
                    <span v-else class="badge-unread">{{ $t('messages.unread') }}</span>
                  </span>
                </div>
                <p class="reply-date">
                  {{ formatDistanceToNow(new Date(reply.created_at), {
                    addSuffix: true, locale:
                      getDateLocale()
                  }) }}
                </p>
                <p class="reply-content">{{ reply.message }}</p>
              </div>
            </div>
          </div>

          <!-- Reply Form -->
          <div class="reply-section">
            <button v-if="!showReplyForm" @click="showReplyForm = true" class="btn-reply">
              {{ $t('messages.reply') }}
            </button>

            <div v-if="showReplyForm" class="reply-form">
              <textarea v-model="replyMessage" :placeholder="$t('messages.replyPlaceholder')" class="reply-textarea"
                rows="4"></textarea>
              <div class="form-actions">
                <button @click="handleSendReply" :disabled="isReplying || !replyMessage.trim()" class="btn-send">
                  {{ isReplying ? $t('messages.sending') : $t('messages.send') }}
                </button>
                <button @click="showReplyForm = false" class="btn-cancel" :disabled="isReplying">
                  {{ $t('common.cancel') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Confirm Delete Dialog -->
  <ConfirmDialog v-model:isOpen="confirmDeleteReplyId" :title="t('messages.deleteReply')"
    :message="t('messages.confirmDeleteReply')" @confirm="handleDeleteReply" />
</template>

<style scoped>
.page-stack {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.page-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.page-title-group {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.page-title {
  font-size: 1.875rem;
  font-weight: 700;
  margin: 0;
}

.badge {
  display: inline-block;
  background-color: var(--c-border);
  color: var(--c-text-base);
  padding: 0.25rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 600;
}

.content-wrapper {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 1.5rem;
  min-height: 600px;
}

@media (max-width: 1280px) {
  .content-wrapper {
    grid-template-columns: 1fr;
  }

  .contact-detail-panel {
    border-top: 1px solid var(--c-border);
    padding-top: 1.5rem;
    margin-top: 1.5rem;
  }
}

.contacts-list-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.error-box {
  padding: 0.75rem 1rem;
  border: 1px solid var(--c-danger-border);
  background-color: var(--c-danger-surface);
  color: var(--c-danger-text);
  border-radius: 0.5rem;
  font-size: 0.875rem;
}

.pagination-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 1rem;
  background-color: var(--c-surface-muted);
  border-radius: 0.5rem;
}

.btn-pagination {
  padding: 0.5rem 1rem;
  background-color: var(--c-surface);
  border: 1px solid var(--c-border-strong);
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.btn-pagination:hover:not(:disabled) {
  background-color: var(--c-surface-muted);
  border-color: var(--c-text-subtle);
}

.btn-pagination:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  font-size: 0.875rem;
  color: var(--c-text-muted);
}

.contact-detail-panel {
  background-color: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: 0.5rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.detail-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid var(--c-border);
  background-color: var(--c-surface-muted);
}

.btn-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  background-color: transparent;
  border: none;
  cursor: pointer;
  color: var(--c-text-muted);
  transition: color 0.2s;
}

.btn-close:hover {
  color: var(--c-text-base);
}

.detail-title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.detail-content {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.sender-info {
  background-color: var(--c-surface-muted);
  border-radius: 0.375rem;
  padding: 0.75rem;
  font-size: 0.875rem;
}

.sender-info p {
  margin: 0.5rem 0;
}

.sender-info strong {
  color: var(--c-text-secondary);
}

.badge-status {
  display: inline-block;
  background-color: var(--c-chart-secondary);
  color: var(--c-surface);
  padding: 0.125rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
}

.message-box {
  background-color: var(--c-surface-muted);
  border-left: 3px solid var(--c-chart-secondary);
  padding: 0.75rem;
  border-radius: 0.375rem;
}

.message-label {
  margin: 0 0 0.5rem 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--c-text-secondary);
}

.message-content {
  margin: 0;
  font-size: 0.875rem;
  color: var(--c-text-base);
  white-space: pre-wrap;
  word-break: break-word;
  line-height: 1.5;
}

.replies-thread {
  border-top: 1px solid var(--c-border);
  padding-top: 1rem;
}

.replies-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  gap: 0.5rem;
}

.replies-title {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--c-text-secondary);
}

.reply-item {
  background-color: var(--c-surface-muted);
  border-radius: 0.375rem;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
}

.reply-display {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.reply-edit-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  background-color: var(--c-surface);
  padding: 0.75rem;
  border: 1px solid var(--c-border-strong);
  border-radius: 0.375rem;
}

.reply-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  font-size: 0.75rem;
}

.reply-actions {
  display: flex;
  gap: 0.25rem;
}

.btn-icon-action {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  background-color: transparent;
  border: none;
  cursor: pointer;
  color: var(--c-text-muted);
  transition: color 0.2s;
  padding: 0;
}

.btn-icon-action:hover {
  color: var(--c-text-base);
}

.btn-icon-action.btn-danger {
  color: var(--c-danger-text);
}

.btn-icon-action.btn-danger:hover {
  color: var(--c-danger-text);
  filter: opacity(0.7);
}

.btn-icon-action:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.reply-sender {
  display: flex;
  align-items: center;
}

.reply-admin-name {
  font-weight: 600;
  color: var(--c-text-base);
  margin-right: 0.5rem;
}

.reply-status {
  display: flex;
  gap: 0.25rem;
}

.badge-read {
  background-color: var(--c-primary-surface);
  color: var(--c-primary-text);
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  font-weight: 600;
}

.badge-unread {
  background-color: var(--c-danger-surface);
  color: var(--c-danger-text);
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  font-weight: 600;
}

.reply-date {
  color: var(--c-text-muted);
  font-size: 0.75rem;
  margin: 0 0 0.5rem 0;
}

.reply-content {
  margin: 0;
  font-size: 0.875rem;
  color: var(--c-text-base);
  white-space: pre-wrap;
  word-break: break-word;
  line-height: 1.5;
}

.reply-section {
  border-top: 1px solid var(--c-border);
  padding-top: 1rem;
  margin-top: 1rem;
}

.btn-reply {
  width: 100%;
  padding: 0.75rem;
  background-color: var(--c-chart-secondary);
  color: var(--c-text-inverted);
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
  transition: background-color 0.2s;
}

.btn-reply:hover {
  background-color: var(--c-chart-secondary);
  filter: brightness(0.9);
}

.reply-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.reply-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--c-border-strong);
  border-radius: 0.375rem;
  font-family: inherit;
  font-size: 0.875rem;
  resize: none;
  background-color: var(--c-surface);
  color: var(--c-text-base);
}

.reply-textarea:focus {
  outline: none;
  border-color: var(--c-chart-secondary);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--c-chart-secondary) 10%, transparent);
}

.form-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-send,
.btn-cancel {
  flex: 1;
  padding: 0.5rem;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-send {
  background-color: var(--c-primary);
  color: var(--c-text-inverted);
}

.btn-send:hover:not(:disabled) {
  background-color: var(--c-primary-hover);
}

.btn-send:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-cancel {
  background-color: var(--c-border);
  color: var(--c-text-secondary);
}

.btn-cancel:hover:not(:disabled) {
  background-color: var(--c-border-strong);
}

.btn-cancel:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.replies-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.btn-mark-read {
  padding: 0.375rem 0.75rem;
  background-color: var(--c-primary);
  color: var(--c-text-inverted);
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 0.75rem;
  font-weight: 600;
  transition: background-color 0.2s;
}

.btn-mark-read:hover {
  background-color: var(--c-primary-hover);
}

.btn-mark-read:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
