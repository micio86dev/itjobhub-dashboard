import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TopList from '../TopList.vue'

const makeItems = (n: number) =>
  Array.from({ length: n }, (_, i) => ({
    label: `Item ${i + 1}`,
    count: 100 - i * 5,
  }))

describe('TopList', () => {
  it('renders the title', () => {
    const wrapper = mount(TopList, { props: { title: 'Top Skills', items: makeItems(3) } })
    expect(wrapper.text()).toContain('Top Skills')
  })

  it('renders at most 10 items when given more than 10', () => {
    const wrapper = mount(TopList, { props: { title: 'Top', items: makeItems(15) } })
    expect(wrapper.findAll('li').length).toBe(10)
  })

  it('renders exactly the number of items when fewer than 10', () => {
    const wrapper = mount(TopList, { props: { title: 'Top', items: makeItems(4) } })
    expect(wrapper.findAll('li').length).toBe(4)
  })

  it('shows "e altri N" footer when items exceed 10', () => {
    const wrapper = mount(TopList, { props: { title: 'Top', items: makeItems(15) } })
    expect(wrapper.text()).toContain('e altri 5')
  })

  it('does not show "e altri" footer when items are 10 or fewer', () => {
    const wrapper = mount(TopList, { props: { title: 'Top', items: makeItems(10) } })
    expect(wrapper.text()).not.toContain('e altri')
  })

  it('renders progress bars via style attribute', () => {
    const items = makeItems(3)
    const wrapper = mount(TopList, { props: { title: 'Top', items } })
    const bars = wrapper.findAll('.bg-green-500')
    expect(bars.length).toBeGreaterThan(0)
    // First item has the highest count — its bar should be 100%
    expect(bars[0].attributes('style')).toContain('100%')
  })

  it('shows skeleton when loading is true', () => {
    const wrapper = mount(TopList, { props: { title: 'Top', items: [], loading: true } })
    expect(wrapper.findAll('li').length).toBe(0)
    expect(wrapper.find('.animate-pulse').exists()).toBe(true)
  })

  it('shows rank numbers starting from 1', () => {
    const wrapper = mount(TopList, { props: { title: 'Top', items: makeItems(3) } })
    const spans = wrapper.findAll('li .text-zinc-400')
    expect(spans[0].text()).toBe('1')
    expect(spans[1].text()).toBe('2')
  })
})
