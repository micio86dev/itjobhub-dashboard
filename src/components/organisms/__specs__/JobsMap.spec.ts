import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import JobsMap from '../JobsMap.vue'
import MapFilters from '../MapFilters.vue'

// matchMedia polyfill is now in test-setup.ts (global)

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
