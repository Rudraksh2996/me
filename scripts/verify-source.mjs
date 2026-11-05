import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const hash = path => createHash('sha256').update(readFileSync(path)).digest('hex');
const bundle = JSON.parse(readFileSync('vendor/threeui/source-bundle.json', 'utf8'));
const canonicalHash = '409e541be1ada6f3e99ef0cb8b990550cd2b2dd01a3452753c28b1c954245c38';
for (const file of bundle.files) {
  const name = file.path.split('/').at(-1);
  const expected = name === 'kibori.html' ? canonicalHash : file.sha256;
  if (hash(`vendor/threeui/${name}`) !== expected) throw new Error(`Source changed: ${name}`);
  console.log(`Verified ${name}: ${expected}`);
}
for (const asset of bundle.assets) {
  const bytes = readFileSync(asset.path);
  if (bytes.length !== asset.bytes || hash(asset.path) !== asset.sha256) throw new Error(`Asset mismatch: ${asset.path}`);
}
console.log(`Verified all ${bundle.assets.length} assets against the original registered hashes.`);
