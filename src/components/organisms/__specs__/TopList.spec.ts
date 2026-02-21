import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TopList from '../TopList.vue'

describe('TopList', () => {
    const mockItems = Array.from({ length: 15 }, (_, i) => ({
        label: `Item ${i + 1}`,
        count: 100 - i
    }))

    it('renders title and top items', () => {
        const wrapper = mount(TopList, {
            props: {
                title: 'Top Skills',
                items: mockItems
            }
        })

        expect(wrapper.text()).toContain('Top Skills')
        // Should render only up to 10 items
        expect(wrapper.findAll('.bg-brand-neon').length).toBe(10)
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

        const bars = wrapper.findAll('.bg-brand-neon')
        expect(bars[0]!.attributes('style')).toContain('width: 100%')
        expect(bars[1]!.attributes('style')).toContain('width: 50%')
        expect(bars[2]!.attributes('style')).toContain('width: 0%')
    })
})
