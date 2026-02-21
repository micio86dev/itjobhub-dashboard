import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import DataTable from '../DataTable.vue'

describe('DataTable', () => {
    const columns = [
        { accessorKey: 'id', header: 'ID' },
        { accessorKey: 'name', header: 'Name' },
    ]
    const data = [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
        { id: 3, name: 'Charlie' }
    ]

    it('renders columns and data properly', () => {
        const wrapper = mount(DataTable, {
            props: {
                columns,
                data
            }
        })

        expect(wrapper.text()).toContain('ID')
        expect(wrapper.text()).toContain('Name')
        expect(wrapper.text()).toContain('Alice')
        expect(wrapper.text()).toContain('Bob')
    })

    it('filters rows with global search input', async () => {
        const wrapper = mount(DataTable, {
            props: {
                columns,
                data,
                searchable: true
            }
        })

        const searchInput = wrapper.find('[data-testid="search-input"]')
        expect(searchInput.exists()).toBe(true)

        await searchInput.setValue('Alice')
        expect(wrapper.text()).toContain('Alice')
        expect(wrapper.text()).not.toContain('Bob')
        expect(wrapper.text()).not.toContain('Charlie')
    })

    it('shows empty state when no search matches or data is empty', async () => {
        const wrapper = mount(DataTable, {
            props: {
                columns,
                data,
                searchable: true
            }
        })

        await wrapper.find('[data-testid="search-input"]').setValue('Zebra')
        expect(wrapper.text()).toContain('Nessun risultato')
        expect(wrapper.find('[data-testid="empty-state"]').exists()).toBe(true)
    })

    it('renders animated skeletons during loading state', () => {
        const wrapper = mount(DataTable, {
            props: {
                columns,
                data: [],
                loading: true
            }
        })

        expect(wrapper.html()).toContain('animate-pulse')
        expect(wrapper.text()).not.toContain('Nessun risultato')
    })

    it('renders export CSV button when exportable is enabled', () => {
        const wrapper = mount(DataTable, {
            props: {
                columns,
                data,
                exportable: true
            }
        })

        expect(wrapper.find('[data-testid="export-csv"]').exists()).toBe(true)
    })
})
