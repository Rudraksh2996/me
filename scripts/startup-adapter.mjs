// Keep the expensive all-station warm-up available for comparison/recovery,
// but let the default opening compile only what its real frames actually draw.
export function adaptStartup(html) {
  const before = "try { await prepareWorkshop(); } catch (e) { console.warn('Workshop warm-up:', e); }";
  if (!html.includes(before)) throw new Error('Upstream startup anchor missing');
  html = html.replace(before, `
const portfolioFullWarmup = new URLSearchParams(location.search).get('warmup') === 'full';
document.documentElement.dataset.startupMode = portfolioFullWarmup ? 'full' : 'on-demand';
performance.mark('portfolio:scene-built');
if (portfolioFullWarmup) {
  try { await prepareWorkshop(); } catch (e) { console.warn('Workshop warm-up:', e); }
}
// No all-scene compile or 48 off-screen scene renders on the normal startup path.
// The original renderer compiles later materials when they are first needed.
performance.mark('portfolio:first-frame-start');`);
  const marker = '<meta charset="utf-8">';
  if (!html.includes(marker)) throw new Error('Upstream head anchor missing');
  html = html.replace(marker, `${marker}
<script>
// Local diagnostics only: no network requests or visible technical readout.
performance.mark('portfolio:start');
new MutationObserver((_, observer) => {
  const loader = document.getElementById('kindle');
  if (!document.documentElement.dataset.startupMode || !document.body || !document.getElementById('gl') || loader) return;
  performance.mark('portfolio:ready');
  const time = name => performance.getEntriesByName(name).at(-1)?.startTime;
  const start = time('portfolio:start');
  const built = time('portfolio:scene-built');
  const frame = time('portfolio:first-frame-start');
  const ready = time('portfolio:ready');
  document.documentElement.dataset.startupTiming = JSON.stringify({
    mode: document.documentElement.dataset.startupMode,
    sceneBuildMs: Math.round(built - start),
    prewarmMs: Math.round(frame - built),
    firstFrameAndRevealMs: Math.round(ready - frame),
    totalMs: Math.round(ready - start)
  });
  observer.disconnect();
}).observe(document.documentElement, {childList:true, subtree:true});
</script>`);
  return html;
}
