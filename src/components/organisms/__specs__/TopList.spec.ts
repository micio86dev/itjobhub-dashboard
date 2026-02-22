import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TopList from '../TopList.vue'

describe('TopList', () => {
    const testItems = Array.from({ length: 15 }, (_, i) => ({
        label: `Item ${i + 1}`,
        count: 100 - i
    }))

    it('renders title and top items', () => {
        const wrapper = mount(TopList, {
            props: {
                title: 'Top Skills',
                items: testItems
            }
        })

        expect(wrapper.text()).toContain('Top Skills')
        // Should render only up to 10 items (visibleItems computed)
        const itemElements = wrapper.findAll('[data-testid="top-list"] .flex.items-center.gap-3')
        expect(itemElements.length).toBeLessThanOrEqual(10)
        // Should show "e altri 5..."
        expect(wrapper.text()).toContain('e altri 5...')
    })

    it('shows empty state when no data', () => {
        const wrapper = mount(TopList, {
            props: {
                title: 'Empty List',
                items: []
            }
        })

        expect(wrapper.text()).toContain('Nessun dato disponibile')
    })

    it('shows skeleton during loading', () => {
        const wrapper = mount(TopList, {
            props: {
                title: 'Loading List',
                items: [],
                loading: true
            }
        })

        expect(wrapper.html()).toContain('animate-pulse')
        expect(wrapper.text()).not.toContain('Nessun dato disponibile')
    })

    it('calculates progress bar widths correctly', () => {
        const items = [
            { label: 'Highest', count: 200 },
            { label: 'Medium', count: 100 },
            { label: 'Lowest', count: 0 }
        ]

        const wrapper = mount(TopList, {
            props: {
                title: 'Progress Test',
                items
            }
        })

        // Find progress bars by style attribute (scoped CSS hashes class names)
        const html = wrapper.html()
        expect(html).toContain('width: 100%')
        expect(html).toContain('width: 50%')
        expect(html).toContain('width: 0%')
    })
})
