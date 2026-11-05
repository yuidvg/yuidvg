import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { readState, writeState, matches, compareEvents } from '../docs/experience-model.mjs';
const content = JSON.parse(await readFile(new URL('../content/experience.json', import.meta.url)));
const data = {years:[...new Set(content.events.map(e=>e.date.slice(0,4)))],tags:[...new Set(content.articles.flatMap(a=>a.tags))]};
const article = id=>content.articles.find(a=>a.id===id);
const state = overrides=>({view:'timeline',category:'all',year:'all',sort:'desc',tags:[],...overrides});
test('multi-select tags match ANY selected technology',()=>{
 assert.equal(matches(article('furniture-system'),state({tags:['C','TabFM']}),article('furniture-system')),true);
 assert.equal(matches(article('clinic-kpi'),state({tags:['C','TabFM']}),article('clinic-kpi')),false);
});
test('category, year and technology filters combine',()=>{
 const event=content.events.find(e=>e.id==='paris-start');
 assert.equal(matches(event,state({category:'education',year:'2024',tags:['C']}),article('42-paris')),true);
 assert.equal(matches(event,state({category:'career',year:'2024',tags:['C']}),article('42-paris')),false);
 assert.equal(matches(event,state({category:'education',year:'2025',tags:['C']}),article('42-paris')),false);
});
test('year matches event or project start rather than inventing interval overlap',()=>{
 assert.equal(matches(article('learning-app'),state({view:'projects',year:'2020'}),article('learning-app')),true);
 assert.equal(matches(article('learning-app'),state({view:'projects',year:'2024'}),article('learning-app')),false);
});
test('project view ignores the temporarily hidden chronology category',()=>{
 assert.equal(matches(article('clinic-kpi'),state({view:'projects',category:'education'}),article('clinic-kpi')),true);
});
test('URL round trip preserves Japanese tags, spaces, multi-selection and sort',()=>{
 const s=state({year:'2026',tags:['Google Apps Script','Googleスプレッドシート'],sort:'asc'});
 assert.deepEqual(readState(writeState(s),data),s);
});
test('invalid URL values are ignored and tags are deduplicated',()=>{
 assert.deepEqual(readState('?view=bad&year=9999&category=bad&sort=bad&tag=C&tag=C&tag=%3Cscript%3E',data),state({view:'projects',tags:['C']}));
});
test('known dates sort chronologically and reverse predictably',()=>{
 const events=[{date:'2024-09'},{date:'2026-04'},{date:'2023-01'}];
 assert.deepEqual([...events].sort((a,b)=>compareEvents(a,b,'asc')).map(e=>e.date),['2023-01','2024-09','2026-04']);
 assert.deepEqual([...events].sort((a,b)=>compareEvents(a,b,'desc')).map(e=>e.date),['2026-04','2024-09','2023-01']);
});
test('year-only dates retain precision and remain at end of their year',()=>{
 const events=[{date:'2019'},{date:'2019-01'},{date:'2019-09'}];
 for(const sort of ['asc','desc'])assert.equal([...events].sort((a,b)=>compareEvents(a,b,sort)).at(-1).date,'2019');
 assert.equal(compareEvents({date:'2018'},{date:'2018'}),0);
});
test('all events resolve to an article; identifiers and dates are valid',()=>{
 assert.equal(new Set(content.events.map(e=>e.id)).size,content.events.length);
 assert.equal(new Set(content.articles.map(e=>e.id)).size,content.articles.length);
 content.events.forEach(e=>{assert.ok(article(e.article));assert.match(e.date,/^\d{4}(-\d{2})?$/);});
 assert.equal(content.articles.filter(a=>a.category==='project').length,5);
});
