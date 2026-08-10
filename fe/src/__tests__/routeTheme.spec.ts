import { applyRouteTheme, router } from '@/router'

describe('route theme', () => {
  beforeEach(() => {
    document.head.innerHTML = '<meta name="theme-color" content="#f1f1ef">'
    delete document.documentElement.dataset.theme
  })

  it('applies the dark document theme for the Watch route', () => {
    applyRouteTheme('dark')

    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(document.querySelector('meta[name="theme-color"]')?.getAttribute('content')).toBe('#171717')
  })

  it('returns the document to the default light theme', () => {
    applyRouteTheme(undefined)

    expect(document.documentElement.dataset.theme).toBe('light')
    expect(document.querySelector('meta[name="theme-color"]')?.getAttribute('content')).toBe('#f1f1ef')
  })

  it('does not expose the removed Schedule route', () => {
    expect(router.resolve('/schedule').name).toBe('not-found')
  })
})
