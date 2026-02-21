import { h } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import type { Job } from '@/types/api'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'
import { it } from 'date-fns/locale'

export const getJobsColumns = (t: (key: string) => string): ColumnDef<Job, unknown>[] => [
    {
        id: 'title',
        header: t('jobsList.columns.title'),
        cell: ({ row }) => {
            const job = row.original
            return h('div', { class: 'flex flex-col' }, [
                h('span', { class: 'font-semibold' }, job.title),
                h('span', { class: 'text-sm text-muted-foreground' }, job.company?.name || '-')
            ])
        }
    },
    {
        accessorKey: 'location',
        header: t('jobsList.columns.location'),
        cell: ({ row }) => {
            return h('span', { class: 'text-sm' }, Array.isArray(row.original.location) ? row.original.location.join(', ') : row.original.location || '-')
        }
    },
    {
        accessorKey: 'employment_type',
        header: t('jobsList.columns.type'),
        cell: ({ row }) => {
            const type = row.original.employment_type
            return h(Badge, { variant: 'secondary' } as unknown as Record<string, unknown>, () => type)
        }
    },
    {
        id: 'salary',
        header: t('jobsList.columns.salary'),
        cell: ({ row }) => {
            const min = row.original.salary_min
            const max = row.original.salary_max
            if (!min && !max) return '-'
            if (min && !max) return `Da €${min.toLocaleString()}`
            if (!min && max) return `Fino a €${max.toLocaleString()}`
            return `€${min?.toLocaleString()} - €${max?.toLocaleString()}`
        }
    },
    {
        accessorKey: 'created_at',
        header: t('jobsList.columns.published'),
        cell: ({ row }) => {
            const dateStr = row.original.created_at
            if (!dateStr) return '-'
            const date = new Date(dateStr)
            return h('div', { title: date.toISOString(), class: 'text-sm text-muted-foreground' },
                formatDistanceToNow(date, { addSuffix: true, locale: it })
            )
        }
    },
    {
        accessorKey: 'status',
        header: t('jobsList.columns.status'),
        cell: ({ row }) => {
            const status = row.original.status || 'draft'
            let variant: 'default' | 'secondary' | 'destructive' | 'outline' = 'outline'

            switch (status.toLowerCase()) {
                case 'active': variant = 'default'; break;
                case 'closed': variant = 'destructive'; break;
                case 'draft':
                default: variant = 'secondary'; break;
            }

            return h(Badge, { variant } as unknown as Record<string, unknown>, () => t(`jobsList.status.${status.toLowerCase()}`))
        }
    }
]
