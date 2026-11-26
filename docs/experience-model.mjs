/** Filtering and URL state for the 仕事・経歴 chronology. */
export const kinds = ['work', 'history'];
/** 仕事 is client work; every other category (職歴・OSS・学歴・受賞) is 経歴. */
export const kindOf = category => category === 'project' ? 'work' : 'history';
export function readState(search, data) {
  const p = new URLSearchParams(search);
  const selected = kinds.filter(k => p.getAll('kind').includes(k));
  return {
    kinds: selected.length ? selected : [...kinds],
    year: data.years.includes(p.get('year')) ? p.get('year') : 'all',
    sort: p.get('sort') === 'asc' ? 'asc' : 'desc',
    tags: [...new Set(p.getAll('tag'))].filter(t => data.tags.includes(t)),
  };
}
export function writeState(state) {
  const p = new URLSearchParams();
  // Both selected is the default and stays out of the URL.
  if (state.kinds.length < kinds.length) state.kinds.forEach(k => p.append('kind', k));
  if (state.year !== 'all') p.set('year', state.year);
  if (state.sort !== 'desc') p.set('sort', state.sort);
  state.tags.forEach(t => p.append('tag', t));
  return p.toString();
}
/** Toggle one kind, keeping at least one selected. */
export function toggleKind(selected, kind) {
  const next = selected.includes(kind) ? selected.filter(k => k !== kind) : [...selected, kind];
  return next.length ? kinds.filter(k => next.includes(k)) : selected;
}
export function matches(entry, state, article) {
  const date = entry.date ?? entry.start;
  return state.kinds.includes(kindOf(entry.category))
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
