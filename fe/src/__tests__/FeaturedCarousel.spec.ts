import { mount } from '@vue/test-utils'

import FeaturedCarousel from '@/components/home/FeaturedCarousel.vue'

const items = [
  { title: 'Alpha', slug: 'alpha', thumb: 'https://example.com/alpha.jpg' },
  { title: 'Beta', slug: 'beta', thumb: 'https://example.com/beta.jpg' },
  { title: 'Gamma', slug: 'gamma', thumb: 'https://example.com/gamma.jpg' },
]

function dispatchPointer(element: Element, type: string, clientX: number) {
  const event = new MouseEvent(type, { bubbles: true, cancelable: true, button: 0, clientX })
  Object.defineProperties(event, {
    pointerId: { value: 1 },
    pointerType: { value: 'mouse' },
  })
  element.dispatchEvent(event)
}

describe('FeaturedCarousel', () => {
  beforeEach(() => {
    vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: false })))
    Object.defineProperty(HTMLElement.prototype, 'scrollTo', {
      configurable: true,
      value: vi.fn(),
    })
  })

  afterEach(() => vi.unstubAllGlobals())

  it('moves to a selected preview and updates the active indicator', async () => {
    const wrapper = mount(FeaturedCarousel, {
      props: { items },
      global: { stubs: { RouterLink: { template: '<a><slot /></a>' } } },
    })

    expect(wrapper.text()).toContain('Featured')
    expect(wrapper.text()).not.toContain('01 / 03')
    expect(wrapper.text()).toContain('Alpha')

    await wrapper.get('[aria-label="Show featured video 2"]').trigger('click')

    expect(wrapper.get('[aria-current="true"]').attributes('aria-label')).toBe('Show featured video 2')
    expect(HTMLElement.prototype.scrollTo).toHaveBeenCalledOnce()
  })

  it('supports direct mouse dragging without using the dots', async () => {
    const wrapper = mount(FeaturedCarousel, {
      props: { items },
      global: { stubs: { RouterLink: { template: '<a><slot /></a>' } } },
    })
    const viewport = wrapper.get('.hero-carousel-viewport')

    dispatchPointer(viewport.element, 'pointerdown', 120)
    dispatchPointer(viewport.element, 'pointermove', 60)
    await wrapper.vm.$nextTick()

    expect((viewport.element as HTMLElement).scrollLeft).toBe(60)
    expect(viewport.classes()).toContain('is-dragging')
  })
})
