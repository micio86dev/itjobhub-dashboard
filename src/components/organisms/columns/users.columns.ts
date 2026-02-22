import { h } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import type { User } from '@/types/api'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { formatDistanceToNow } from 'date-fns'
import { it } from 'date-fns/locale'

export const getUsersColumns = (t: (key: string) => string): ColumnDef<User, unknown>[] => [
    {
        id: 'user',
        header: t('users.columns.user'),
        cell: ({ row }) => {
            const user = row.original
            const initials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase()
            return h('div', { class: 'flex items-center gap-3' }, [
                h(Avatar, { class: 'h-8 w-8' }, () => [
                    h(AvatarImage, { src: user.avatar || '', alt: user.firstName }),
                    h(AvatarFallback, () => initials)
                ]),
                h('div', { class: 'flex flex-col' }, [
                    h('span', { class: 'font-medium' }, `${user.firstName} ${user.lastName}`),
                ])
            ])
        }
    },
    {
        accessorKey: 'lastName',
        header: 'Cognome',
    },
    {
        accessorKey: 'email',
        header: t('users.columns.email'),
    },
    {
        accessorKey: 'role', // Spec says login method, but User api type has role, oauth_provider
        header: t('users.columns.method'),
        cell: ({ row }) => {
            const provider = row.original.oauth_provider || 'email'

            let bgColorClass = ''

            switch (provider) {
                case 'email': bgColorClass = 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100'; break;
                case 'google': bgColorClass = 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'; break;
                case 'linkedin': bgColorClass = 'bg-blue-800 text-white dark:bg-blue-700'; break;
                case 'github': bgColorClass = 'bg-black text-white dark:bg-zinc-900'; break;
                default: bgColorClass = 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100'; break;
            }

            return h(Badge, { class: bgColorClass, variant: 'outline' } as unknown as Record<string, unknown>, () => provider)
        }
    },
    {
        accessorKey: 'created_at',
        header: t('users.columns.registered'),
        cell: ({ row }) => {
            const dateStr = row.original.created_at
            if (!dateStr) return '-'
            const date = new Date(dateStr)
            return h('div', { title: date.toISOString(), class: 'text-muted-foreground' },
                formatDistanceToNow(date, { addSuffix: true, locale: it })
            )
        }
    }
]
