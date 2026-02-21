import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import JobsMap from '../JobsMap.vue'
import MapFilters from '../MapFilters.vue'

Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
})

describe('JobsMap', () => {
    it('renders map container without crashing', () => {
        const wrapper = mount(JobsMap, {
            props: {
                jobs: [],
                filters: { remote: 'all' }
            }
        })

        expect(wrapper.find('[data-testid="jobs-map"]').exists()).toBe(true)
    })

    it('shows loading state correctly', () => {
        const wrapper = mount(JobsMap, {
            props: {
                jobs: [],
                filters: { remote: 'all' },
                loading: true
            }
        })

        expect(wrapper.text()).toContain('Caricamento mappa...')
    })
})

describe('MapFilters', () => {
    it('renders filter panel successfully', () => {
        const wrapper = mount(MapFilters, {
            props: {
                resultCount: 42
            }
        })

        expect(wrapper.text()).toContain('Filtri')
        expect(wrapper.text()).toContain('42 trovati')
        expect(wrapper.find('[data-testid="map-filters"]').exists()).toBe(true)
    })
})
