import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import type { ColumnDef } from '@tanstack/vue-table'
import DataTable from '../DataTable.vue'

interface TestRow {
  id: string
  name: string
  value: number
}

const columns: ColumnDef<TestRow>[] = [
  { id: 'name', accessorKey: 'name', header: 'Name' },
  { id: 'value', accessorKey: 'value', header: 'Value' },
]

const data: TestRow[] = [
  { id: '1', name: 'Alice', value: 10 },
  { id: '2', name: 'Bob', value: 20 },
  { id: '3', name: 'Charlie', value: 30 },
]

describe('DataTable', () => {
  it('renders [data-testid="data-table"]', () => {
    const wrapper = mount(DataTable, { props: { columns, data } })
    expect(wrapper.find('[data-testid="data-table"]').exists()).toBe(true)
  })

  it('renders one row per data item', () => {
    const wrapper = mount(DataTable, { props: { columns, data } })
    expect(wrapper.find('[data-testid="row-0"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="row-1"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="row-2"]').exists()).toBe(true)
  })

  it('shows [data-testid="empty-state"] when data is empty', () => {
    const wrapper = mount(DataTable, { props: { columns, data: [] } })
    expect(wrapper.find('[data-testid="empty-state"]').exists()).toBe(true)
  })

  it('shows skeleton rows when loading', () => {
    const wrapper = mount(DataTable, { props: { columns, data: [], loading: true } })
    expect(wrapper.find('[data-testid="empty-state"]').exists()).toBe(false)
    expect(wrapper.find('.animate-pulse').exists()).toBe(true)
  })

  it('filters rows by search input', async () => {
    const wrapper = mount(DataTable, { props: { columns, data } })
    const input = wrapper.find('[data-testid="search-input"]')
    await input.setValue('Alice')
    expect(wrapper.find('[data-testid="row-0"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="row-1"]').exists()).toBe(false)
  })

  it('shows export button only when exportable prop is true', () => {
    const withExport = mount(DataTable, { props: { columns, data, exportable: true } })
    const withoutExport = mount(DataTable, { props: { columns, data, exportable: false } })
    expect(withExport.find('[data-testid="export-csv"]').exists()).toBe(true)
    expect(withoutExport.find('[data-testid="export-csv"]').exists()).toBe(false)
  })

  it('triggers CSV download when export button is clicked', async () => {
    const createObjectURL = vi.fn().mockReturnValue('blob:url')
    const revokeObjectURL = vi.fn()
    const click = vi.fn()
    vi.stubGlobal('URL', { createObjectURL, revokeObjectURL })
    // Spy on document.createElement to intercept anchor click
    const origCreate = document.createElement.bind(document)
    vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
      const el = origCreate(tag)
      if (tag === 'a') {
        Object.defineProperty(el, 'click', { value: click })
      }
      return el
    })
    const wrapper = mount(DataTable, { props: { columns, data, exportable: true } })
    await wrapper.find('[data-testid="export-csv"]').trigger('click')
    expect(createObjectURL).toHaveBeenCalled()
    expect(click).toHaveBeenCalled()
    vi.restoreAllMocks()
  })

  it('renders column headers', () => {
    const wrapper = mount(DataTable, { props: { columns, data } })
    expect(wrapper.text()).toContain('Name')
    expect(wrapper.text()).toContain('Value')
  })
})
