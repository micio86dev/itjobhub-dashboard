import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import StatCard from '../StatCard.vue'

describe('StatCard', () => {
    it('renders title and value', () => {
        const wrapper = mount(StatCard, {
            props: {
                title: 'Total Users',
                value: '1,234'
            }
        })

        expect(wrapper.text()).toContain('Total Users')
        expect(wrapper.find('[data-testid="stat-value"]').text()).toBe('1,234')
    })

    it('renders positive change in green with arrow up', () => {
        const wrapper = mount(StatCard, {
            props: {
                title: 'Revenue',
                value: '$12K',
                change: 15
            }
        })

        const changeEl = wrapper.find('[data-testid="stat-change"]')
        expect(changeEl.exists()).toBe(true)
        expect(changeEl.text()).toContain('15%')
        expect(changeEl.classes()).toContain('text-green-500')
        // lucide-vue-next ArrowUpRight creates an svg which we can check exists
        expect(wrapper.find('svg.lucide-arrow-up-right').exists()).toBe(true)
    })

    it('renders negative change in red with arrow down', () => {
        const wrapper = mount(StatCard, {
            props: {
                title: 'Bounce Rate',
                value: '42%',
                change: -5
            }
        })

        const changeEl = wrapper.find('[data-testid="stat-change"]')
        expect(changeEl.classes()).toContain('text-red-500')
        expect(changeEl.text()).toContain('5%') // absolute value
        expect(wrapper.find('svg.lucide-arrow-down-right').exists()).toBe(true)
    })

    it('shows skeleton when loading', () => {
        const wrapper = mount(StatCard, {
            props: {
                title: 'Loading Stat',
                value: 100,
                loading: true
            }
        })

        expect(wrapper.find('.lucide-arrow-up-right').exists()).toBe(false)
        expect(wrapper.find('[data-testid="stat-value"]').exists()).toBe(false)
        // Skeletons are rendered
        expect(wrapper.html()).toContain('animate-pulse')
    })
})
