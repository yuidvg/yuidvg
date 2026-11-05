import { readState, writeState, matches, compareEvents } from './experience-model.mjs';

const explorer = document.querySelector('#work');
const source = document.querySelector('#experience-data');
if (explorer && source) {
  const data = JSON.parse(source.textContent);
  const articles = new Map(data.articles.map(a => [a.id, a]));
  const eventElements = new Map([...explorer.querySelectorAll('[data-event]')].map(el => [el.dataset.event, el]));
  const projectElements = new Map([...explorer.querySelectorAll('[data-project]')].map(el => [el.dataset.project, el]));
  const yearGroups = [...explorer.querySelectorAll('.chronology-year')];
  const projectView = explorer.querySelector('#project-view');
  const timelineView = explorer.querySelector('#timeline-view');
  const preview = explorer.querySelector('.reading-preview');
  const previewContent = explorer.querySelector('[data-preview-content]');
  const desktop = window.matchMedia('(min-width: 960px) and (hover: hover)');
  const category = explorer.querySelector('#category-filter');
  const year = explorer.querySelector('#year-filter');
  const sort = explorer.querySelector('#sort-filter');
  const selectedTags = explorer.querySelector('[data-selected-tags]');
  let state = readState(location.search, data);
  let previewId = null;
  let activeEvent = null;
  let timer;
  let suppressFocusPreview = false;
  let visibleEvents = [];

  function showPreview(id, eventId) {
    if (!desktop.matches || state.view !== 'timeline') return;
    if (id !== previewId) {
      const template = document.getElementById(`preview-${id}`);
      if (!template) return;
      previewContent.replaceChildren(template.content.cloneNode(true));
      preview.scrollTop = 0;
      previewId = id;
    }
    activeEvent = eventId;
    preview.hidden = false;
    timelineView.classList.add('has-preview');
    eventElements.forEach((el, key) => el.classList.toggle('is-previewed', key === eventId));
  }
  function closePreview() {
    clearTimeout(timer);
    preview.hidden = true;
    timelineView.classList.remove('has-preview');
    eventElements.forEach(el => el.classList.remove('is-previewed'));
    previewId = null;
    activeEvent = null;
  }
  function updateUrl() {
    const query = writeState(state);
    const next = location.pathname + (query ? `?${query}` : '') + location.hash;
    if (next !== location.pathname + location.search + location.hash) history.pushState(null, '', next);
  }
  function render() {
    clearTimeout(timer);
    const timeline = state.view === 'timeline';
    projectView.hidden = timeline;
    timelineView.hidden = !timeline;
    explorer.querySelectorAll('[data-view]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.view === state.view)));
    explorer.querySelector('[data-category-control]').hidden = !timeline;
    explorer.querySelector('[data-sort-control]').hidden = !timeline;
    category.value = state.category;
    year.value = state.year;
    sort.value = state.sort;
    let count = 0;
    projectElements.forEach((el, id) => {
      const a = articles.get(id);
      el.hidden = !matches(a, state, a);
      if (!timeline && !el.hidden) count++;
    });
    visibleEvents = data.events.filter(event => matches(event, state, articles.get(event.article))).sort((a, b) => compareEvents(a, b, state.sort));
    const visibleIds = new Set(visibleEvents.map(v => v.id));
    eventElements.forEach((el, id) => { el.hidden = !visibleIds.has(id); });
    yearGroups.sort((a, b) => state.sort === 'asc' ? a.dataset.year.localeCompare(b.dataset.year) : b.dataset.year.localeCompare(a.dataset.year));
    const list = explorer.querySelector('.chronology-list');
    for (const group of yearGroups) {
      const items = visibleEvents.filter(v => v.date.startsWith(group.dataset.year));
      group.hidden = !items.length;
      items.forEach(v => group.querySelector('ol').append(eventElements.get(v.id)));
      list.append(group);
    }
    if (timeline) count = visibleEvents.length;
    explorer.querySelector('[data-empty]').hidden = count > 0;
    explorer.querySelector('#result-count').textContent = `${timeline ? '時系列' : '仕事一覧'} · ${count}件`;
    const filtered = state.tags.length > 0 || state.year !== 'all' || (timeline && state.category !== 'all');
    explorer.querySelector('.filter-feedback [data-reset]').hidden = !filtered;
    selectedTags.replaceChildren(...state.tags.map(tag => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'tech-tag';
      button.dataset.tag = tag;
      button.textContent = tag;
      button.setAttribute('aria-label', `${tag}の選択を解除`);
      return button;
    }));
    explorer.querySelectorAll('[data-tag]').forEach(button => {
      button.setAttribute('aria-pressed', String(state.tags.includes(button.dataset.tag)));
      if (button.tagName === 'A') button.setAttribute('role', 'button');
    });
    if (!timeline || !visibleIds.has(activeEvent) || !desktop.matches) closePreview();
    if (timeline && visibleEvents.length && preview.hidden && desktop.matches) {
      showPreview(visibleEvents[0].article, visibleEvents[0].id);
    }
  }
  function change(update) {
    state = { ...state, ...update };
    updateUrl();
    render();
  }
  explorer.addEventListener('click', event => {
    const control = event.target.closest('[data-tag], [data-view], [data-reset], [data-preview-close]');
    if (!control || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (control.matches('[data-tag]')) {
      event.preventDefault();
      const tag = control.dataset.tag;
      const wasSelected = control.closest('[data-selected-tags]');
      change({ tags: state.tags.includes(tag) ? state.tags.filter(t => t !== tag) : [...state.tags, tag] });
      if (wasSelected) explorer.querySelector('.tag-filter summary').focus({preventScroll:true});
    } else if (control.matches('[data-view]')) {
      change({ view: control.dataset.view });
    } else if (control.matches('[data-reset]')) {
      change({ tags: [], year: 'all', category: 'all' });
      explorer.querySelector('.tag-filter summary').focus({preventScroll:true});
    } else {
      const oldEvent = activeEvent;
      closePreview();
      suppressFocusPreview = true;
      eventElements.get(oldEvent)?.querySelector('.event-link').focus({preventScroll:true});
      suppressFocusPreview = false;
    }
  });
  explorer.addEventListener('keydown', event => {
    if (event.code === 'Space' && event.target.matches('a[data-tag]')) {
      event.preventDefault();
      event.target.click();
    }
    if (event.key === 'Escape' && !preview.hidden) {
      const oldEvent = activeEvent;
      closePreview();
      if (preview.contains(document.activeElement)) {
        suppressFocusPreview = true;
        eventElements.get(oldEvent)?.querySelector('.event-link').focus({preventScroll:true});
        suppressFocusPreview = false;
      }
    }
  });
  category.addEventListener('change', () => change({ category: category.value }));
  year.addEventListener('change', () => change({ year: year.value }));
  sort.addEventListener('change', () => change({ sort: sort.value }));
  eventElements.forEach((el, id) => {
    const entry = data.events.find(v => v.id === id);
    el.addEventListener('pointerenter', event => {
      if (event.pointerType === 'touch') return;
      clearTimeout(timer);
      timer = setTimeout(() => showPreview(entry.article, id), 130);
    });
    el.addEventListener('pointerleave', () => clearTimeout(timer));
    el.querySelector('.event-link').addEventListener('focus', () => {
      if (!suppressFocusPreview) showPreview(entry.article, id);
    });
  });
  window.addEventListener('popstate', () => { state = readState(location.search, data); render(); });
  desktop.addEventListener('change', render);
  explorer.classList.add('experience-ready');
  explorer.querySelector('[data-explorer-controls]').hidden = false;
  render();
}
