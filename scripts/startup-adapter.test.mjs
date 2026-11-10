import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { adaptStartup } from './startup-adapter.mjs';

const source = readFileSync('vendor/threeui/kibori.html', 'utf8');
const adapted = adaptStartup(source);
const start = adapted.indexOf('const portfolioFullWarmup =');
const endMarker = "performance.mark('portfolio:first-frame-start');";
const end = adapted.indexOf(endMarker, start) + endMarker.length;
const boot = new (Object.getPrototypeOf(async function(){}).constructor)(
  'location', 'document', 'performance', 'prepareWorkshop', 'console',
  adapted.slice(start, end),
);

test('normal entry never waits for all-station preparation', async () => {
  const document = {documentElement: {dataset: {}}};
  const marks = [];
  await boot({search: ''}, document, {mark: value => marks.push(value)}, () => {
    assert.fail('Full preparation must not run on normal entry');
  }, console);
  assert.equal(document.documentElement.dataset.startupMode, 'on-demand');
  assert.deepEqual(marks, ['portfolio:scene-built', 'portfolio:first-frame-start']);
});

test('explicit comparison mode waits for full preparation before first frame', async () => {
  const document = {documentElement: {dataset: {}}};
  const events = [];
  let finish;
  const pending = new Promise(resolve => { finish = resolve; });
  const running = boot({search:'?warmup=full'}, document, {mark: value => events.push(value)}, () => {
    events.push('prepare');
    return pending;
  }, console);
  assert.deepEqual(events, ['portfolio:scene-built', 'prepare']);
  finish();
  await running;
  assert.equal(document.documentElement.dataset.startupMode, 'full');
  assert.equal(events.at(-1), 'portfolio:first-frame-start');
});

test('comparison warm-up failure does not prevent the real first frame', async () => {
  const marks = [], warnings = [];
  await boot({search:'?warmup=full'}, {documentElement:{dataset:{}}}, {mark: value => marks.push(value)},
    async () => { throw new Error('simulated GPU warm-up failure'); },
    {warn: (...args) => warnings.push(args)},
  );
  assert.equal(warnings.length, 1);
  assert.equal(marks.at(-1), 'portfolio:first-frame-start');
});

test('upstream changes fail explicitly instead of silently restoring slow boot', () => {
  assert.throws(() => adaptStartup('<html></html>'), /startup anchor missing/);
});

test('timings are published only after boot reached rendering and the loader was removed', () => {
  const code = adapted.match(/<script>\n\/\/ Local diagnostics[\s\S]*?<\/script>/)[0]
    .replace(/^<script>/, '').replace(/<\/script>$/, '');
  const document = {documentElement: {dataset:{}}, body:{}, getElementById: id => id === 'gl' ? {} : null};
  let observe;
  let disconnected = false;
  class Observer {
    constructor(callback) { observe = () => callback([], this); }
    observe() {}
    disconnect() { disconnected = true; }
  }
  const entries = {'portfolio:start':0, 'portfolio:scene-built':100, 'portfolio:first-frame-start':101};
  new Function('document', 'performance', 'MutationObserver', code)(document, {
    mark: name => { if (name === 'portfolio:ready') entries[name] = 200; },
    getEntriesByName: name => [{startTime:entries[name]}],
  }, Observer);
  observe();
  assert.equal(document.documentElement.dataset.startupTiming, undefined);
  document.documentElement.dataset.startupMode = 'on-demand';
  document.getElementById = () => ({});
  observe();
  assert.equal(document.documentElement.dataset.startupTiming, undefined);
  document.getElementById = id => id === 'gl' ? {} : null;
  observe();
  const timing = JSON.parse(document.documentElement.dataset.startupTiming);
  assert.equal(timing.totalMs, 200);
  assert.equal(timing.prewarmMs, 1);
  assert.equal(disconnected, true);
});
