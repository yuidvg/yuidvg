/** Filtering is shared by project cards, chronology and URL state. */
export const categories = ['all', 'project', 'career', 'education', 'award'];
export function readState(search, data) {
  const p = new URLSearchParams(search);
  return {
    view: p.get('view') === 'timeline' ? 'timeline' : 'projects',
    category: categories.includes(p.get('category')) ? p.get('category') : 'all',
    year: data.years.includes(p.get('year')) ? p.get('year') : 'all',
    sort: p.get('sort') === 'asc' ? 'asc' : 'desc',
    tags: [...new Set(p.getAll('tag'))].filter(t => data.tags.includes(t)),
  };
}
export function writeState(state) {
  const p = new URLSearchParams();
  if (state.view !== 'projects') p.set('view', state.view);
  if (state.category !== 'all') p.set('category', state.category);
  if (state.year !== 'all') p.set('year', state.year);
  if (state.sort !== 'desc') p.set('sort', state.sort);
  state.tags.forEach(t => p.append('tag', t));
  return p.toString();
}
export function matches(entry, state, article) {
  const date = entry.date ?? entry.start;
  return (state.view === 'projects' || state.category === 'all' || entry.category === state.category)
    && (state.year === 'all' || date.slice(0, 4) === state.year)
    && (!state.tags.length || state.tags.some(t => article.tags.includes(t)));
}
export function compareEvents(a, b, order = 'desc') {
  const sign = order === 'asc' ? 1 : -1;
  const year = a.date.slice(0, 4).localeCompare(b.date.slice(0, 4));
  if (year) return year * sign;
  // Unknown months remain grouped at the end of their year in either direction.
  if (a.date.length !== b.date.length) return b.date.length - a.date.length;
  return (a.date.localeCompare(b.date) * sign) || 0;
}
