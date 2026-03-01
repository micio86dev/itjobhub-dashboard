import { useQuery } from '@tanstack/vue-query'
import { computed } from 'vue'
import { http } from '@/api/client'

/**
 * Fetch unread messages count for admin
 */
const getUnreadMessagesCount = async (): Promise<number> => {
  try {
    const response = await http.get<{ count: number }>('/messages/admin/unread-count')
    const data: any = response.data

    // Handle double-wrapped response: response.data might be { success, data: { count } }
    const count = data?.data?.count ?? data?.count ?? 0
    return count
  } catch (error) {
    console.error('Error fetching unread count:', error)
    return 0
  }
}

/**
 * Composable for managing unread messages count
 * Provides reactive unread count and refetch functionality
 */
export function useUnreadMessages() {
  const unreadQuery = useQuery({
    queryKey: ['unreadMessagesCount'],
    queryFn: getUnreadMessagesCount,
    // Refetch every 30 seconds
    refetchInterval: 30000,
    // Retry on error
    retry: 2,
    // Start with undefined instead of 0 to allow proper loading state
    staleTime: 0,
  })

  // Create computed that always returns a number, defaulting to 0 if undefined
  const unreadCount = computed(() => {
    const value = unreadQuery.data.value
    return value ?? 0
  })
  const isLoading = unreadQuery.isPending
  const isError = unreadQuery.isError
  const error = unreadQuery.error

  /**
   * Manually refetch the unread count
   */
  const refetch = () => {
    return unreadQuery.refetch()
  }

  return {
    unreadCount,
    isLoading,
    isError,
    error,
    refetch,
  }
}
