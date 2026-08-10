export interface AnimeSeason {
  name: 'Winter' | 'Spring' | 'Summer' | 'Fall'
  year: number
  label: string
  slug: string
}

export function getAnimeSeason(date = new Date()): AnimeSeason {
  const month = date.getMonth()
  const name = month < 3 ? 'Winter' : month < 6 ? 'Spring' : month < 9 ? 'Summer' : 'Fall'
  const year = date.getFullYear()

  return {
    name,
    year,
    label: `${name} ${year}`,
    slug: `${name.toLowerCase()}-${year}`,
  }
}
