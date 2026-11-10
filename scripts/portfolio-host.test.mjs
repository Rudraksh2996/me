import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ts from 'typescript';

const require = createRequire(import.meta.url);
const { outputText } = ts.transpileModule(
  readFileSync('src/shaders/kibori-landing-page/KiboriLandingPage.tsx', 'utf8'),
  {compilerOptions: {module:ts.ModuleKind.CommonJS, jsx:ts.JsxEmit.ReactJSX, target:ts.ScriptTarget.ES2022}},
);
function renderHost(hidden) {
  const exports = {};
  new Function('require', 'exports', 'document', outputText)(require, exports, {hidden});
  return renderToStaticMarkup(React.createElement(exports.KiboriLandingPage));
}

test('a hidden document retains the workshop iframe instead of discarding its scene', () => {
  const html = renderHost(true);
  assert.match(html, /<iframe /);
  assert.match(html, /data-state="paused"/);
  assert.match(html, /src="\/landing-pages\/kibori.html"/);
});

test('visible document retains the normal loading state and iframe sandbox', () => {
  const html = renderHost(false);
  assert.match(html, /<iframe /);
  assert.match(html, /data-state="loading"/);
  assert.match(html, /sandbox="allow-scripts allow-forms/);
});
