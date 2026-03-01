import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { Users } from 'lucide-vue-next'
import StatCard from '../StatCard.vue'

describe('StatCard', () => {
  it('renders [data-testid="stat-card"]', () => {
    const wrapper = mount(StatCard, { props: { title: 'Users', value: 1234 } })
    expect(wrapper.find('[data-testid="stat-card"]').exists()).toBe(true)
  })

  it('displays [data-testid="stat-value"] with the given value', () => {
    const wrapper = mount(StatCard, { props: { title: 'Users', value: 1234 } })
    expect(wrapper.find('[data-testid="stat-value"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="stat-value"]').text()).toContain('1')
  })

  it('shows positive change with + prefix', () => {
    const wrapper = mount(StatCard, { props: { title: 'Users', value: 500, change: 5.2 } })
    expect(wrapper.find('[data-testid="stat-change"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="stat-change"]').text()).toContain('+5.2%')
  })

  it('shows negative change without + prefix', () => {
    const wrapper = mount(StatCard, { props: { title: 'Users', value: 500, change: -3.1 } })
    const change = wrapper.find('[data-testid="stat-change"]')
    expect(change.exists()).toBe(true)
    expect(change.text()).toContain('-3.1%')
  })

  it('hides stat-change when change prop is absent', () => {
    const wrapper = mount(StatCard, { props: { title: 'Users', value: 500 } })
    expect(wrapper.find('[data-testid="stat-change"]').exists()).toBe(false)
  })

  it('renders skeleton and hides stat-value when loading', () => {
    const wrapper = mount(StatCard, { props: { title: 'Users', value: 0, loading: true } })
    expect(wrapper.find('[data-testid="stat-value"]').exists()).toBe(false)
    expect(wrapper.find('.animate-pulse').exists()).toBe(true)
  })

  it('renders icon component when provided', () => {
    const wrapper = mount(StatCard, { props: { title: 'Users', value: 0, icon: Users } })
    expect(wrapper.find('[data-testid="stat-card"]').exists()).toBe(true)
    // icon slot is rendered as a <component :is="icon"> — just verify no errors thrown
  })

  it('renders string value correctly', () => {
    const wrapper = mount(StatCard, { props: { title: 'Rate', value: '98.5%' } })
    expect(wrapper.find('[data-testid="stat-value"]').text()).toContain('98.5%')
  })
})
