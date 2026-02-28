import { http } from './client'
import type { ApiResponse } from './client'

export interface Contact {
  id: string
  sender_name: string
  sender_email: string
  subject: string
  message: string
  is_sender_logged_in: boolean
  user?: {
    id: string
    first_name: string
    last_name: string
    email: string
  }
  replies: Array<ContactReply>
  created_at: string
  updated_at?: string
}

export interface ContactReply {
  id: string
  contact_id: string
  replier_id: string
  message: string
  created_at: string
  read_by_sender: boolean
  read_at?: string
  replier: {
    id: string
    first_name: string
    last_name: string
    email: string
    avatar?: string
  }
}

export interface GetContactsParams {
  page?: number
  limit?: number
}

export interface GetContactsResponse {
  success: boolean
  data: Contact[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export interface GetContactResponse {
  success: boolean
  data: Contact & {
    replies: ContactReply[]
  }
}

export interface ReplyParams {
  message: string
}

export interface ReplyResponse {
  success: boolean
  message: string
  data: ContactReply
}

/**
 * Get all contacts (admin only)
 */
export function getContacts(params?: GetContactsParams): Promise<ApiResponse<GetContactsResponse>> {
  return http.get<GetContactsResponse>('/messages/admin/contacts', params)
}

/**
 * Get a specific contact by ID
 */
export function getContact(contactId: string): Promise<ApiResponse<GetContactResponse>> {
  return http.get<GetContactResponse>(`/messages/contacts/${contactId}`)
}

/**
 * Reply to a contact
 */
export function replyToContact(contactId: string, data: ReplyParams): Promise<ApiResponse<ReplyResponse>> {
  return http.post<ReplyResponse>(`/messages/contacts/${contactId}/reply`, data)
}

/**
 * Mark all replies as read
 */
export function markContactAsRead(contactId: string): Promise<ApiResponse<{ success: boolean }>> {
  return http.put<{ success: boolean }>(`/messages/contacts/${contactId}/mark-read`, {})
}

/**
 * Delete a contact (admin only)
 */
export function deleteContact(contactId: string): Promise<ApiResponse<{ success: boolean }>> {
  return http.delete<{ success: boolean }>(`/messages/contacts/${contactId}`)
}

/**
 * Get user's own contacts and replies
 */
export function getUserContacts(params?: { page?: number; limit?: number }): Promise<ApiResponse<GetContactsResponse>> {
  return http.get<GetContactsResponse>('/messages/user/me/contacts', params)
}
