import { mount } from '@vue/test-utils'

import MechanicalPagination from '@/components/ui/MechanicalPagination.vue'

describe('MechanicalPagination', () => {
  it('renders a five-page window when the total is known', async () => {
    const wrapper = mount(MechanicalPagination, {
      props: { current: 5, total: 12, hasPrevious: true, hasNext: true },
    })

    expect(wrapper.findAll('button[aria-label^="Page "]')).toHaveLength(5)
    expect(wrapper.text()).not.toContain('…')
    expect(wrapper.get('[aria-current="page"]').text()).toBe('5')

    await wrapper.get('[aria-label="Page 6"]').trigger('click')
    expect(wrapper.emitted('change')).toEqual([[6]])
  })

  it('shows only the current number when the total is unknown', () => {
    const wrapper = mount(MechanicalPagination, {
      props: { current: 3, hasPrevious: true, hasNext: true },
    })

    expect(wrapper.findAll('button[aria-label^="Page "]')).toHaveLength(1)
    expect(wrapper.get('[aria-current="page"]').text()).toBe('3')
  })
})
