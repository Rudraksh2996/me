// Keep upstream inputs pristine. All deliberate substitutions happen here.
import './verify-source.mjs';
import { readFileSync, writeFileSync, copyFileSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
const data = JSON.parse(readFileSync('src/portfolio-data.json', 'utf8'));
const bundle = JSON.parse(readFileSync('vendor/threeui/source-bundle.json', 'utf8'));
const escape = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let html = readFileSync('vendor/threeui/kibori.html', 'utf8');
function replace(from, to) {
  if (!html.includes(from)) throw new Error(`Upstream anchor missing: ${String(from).slice(0, 80)}`);
  html = html.replace(from, to);
}
const link = (url, label) => `<a href="${escape(url)}" target="_blank" rel="noopener noreferrer">${escape(label)} ↗</a>`;
const assetPrefix = 'https://ublctyddhtbgaersvxxb.supabase.co/storage/v1/object/public/threeui-media/scene-images/kibori/';
for (const asset of bundle.assets) {
  const ext = asset.path.split('.').at(-1);
  html = html.replaceAll(`${assetPrefix}${asset.sha256}.${ext}`, `./kibori-assets/${asset.path.split('/').at(-1)}`);
}
html = html.replaceAll('https://unpkg.com/three@0.169.0/build/three.module.min.js', './three.module.min.js');
replace('<title>KIBORI — 木彫</title>', `<title>${escape(data.name)} — Web Developer</title>`);
replace('KIBORI 木彫 — eight Japanese woodcrafts, from kumiko lattice to the kanna plane, made to commission in Kyoto.', escape(data.bio));
replace('</head>', `<meta property="og:title" content="${escape(data.name)} — Web Developer"><meta property="og:description" content="${escape(data.bio)}"><meta property="og:type" content="website"><meta property="og:image" content="/landing-pages/kibori-assets/kibori-workshop-print-v2.webp"><link rel="stylesheet" href="./portfolio.css"></head>`);
replace('aria-label="KIBORI — back to the first craft">KIBORI', `aria-label="${escape(data.name)} — back to the beginning">RUDRAKSH`);
replace('>The crafts</a>', '>Projects</a>');
replace('>Atelier</a>', '>About / Skills</a>');
replace('>Commission</a>', '>Get in touch</a>');
replace('<span class="lk-word">KIBORI</span>', '<span class="lk-word">RUDRAKSH</span>');
replace('<span class="lk-word">RUDRAKSH</span>', '<span class="lk-word" role="heading" aria-level="1" aria-label="Rudraksh Sharma">RUDRAKSH</span>');
replace('Eight crafts of a Kyoto woodshop, each made to order', escape(data.role));
const kanji = ['組子','青海波','木組','焼杉','鑿','漆','指物','鉋'];
// This authored copy update counts wood strips, not portfolio facts.
replace("document.querySelector('.chapter .meta').querySelectorAll('b')[1].textContent=kumikoLattice.count.toLocaleString();", '// Portfolio metadata is supplied by portfolio-data.json; retain it unchanged.');
// Only the chapter copy changes; all authored chapter containers and poses remain.
for (const [i, chapter] of data.chapters.entries()) {
  const project = data.projects.find(p => p.id === chapter.project);
  const re = new RegExp(`(<div class="chapter[^"\\n]*" id="ch${i}">)[\\s\\S]*?(?=\\n  </div>)`);
  if (!re.test(html)) throw new Error(`Missing chapter ${i}`);
  const right = i % 2;
  const number = `${String(i+1).padStart(2,'0')} — ${escape(chapter.label)}`;
  const meta = chapter.meta.map(([key,value])=>`<div>${escape(key)}<b>${escape(value)}</b></div>`).join('');
  html = html.replace(re, `$1
    <div class="num">${right ? number+'<s></s>' : '<s></s>'+number}</div>
    <div class="big portfolio-title">${right ? `<em lang="ja">${kanji[i]}</em>` : ''}${escape(chapter.title)}${right ? '' : `<em lang="ja">${kanji[i]}</em>`}</div>
    <div class="lede">${escape(chapter.description)}</div>
    <div class="meta">${meta}</div>
    <div class="project-actions">${link(project.url, 'View project')}<button type="button" data-inspect="${i}">Explore craft <span aria-hidden="true">↗</span></button></div>`);
}
const indexStart = html.indexOf('const INDEX = [');
const indexEnd = html.indexOf('];', indexStart) + 2;
if (indexStart < 0) throw new Error('Missing INDEX');
html = html.slice(0,indexStart) + `const INDEX = ${JSON.stringify(data.chapters.map((c,i)=>[String(i+1).padStart(2,'0'),c.title,kanji[i]]))};` + html.slice(indexEnd);
replace('aria-label="Commission a piece from KIBORI"', `aria-label="Get in touch with ${escape(data.name)}"`);
replace('aria-label="Commission details"', 'aria-label="Contact, projects, skills, and experience"');
replace('<div class="eyebrow"><s aria-hidden="true"></s>Commission</div>', '<div class="eyebrow"><s aria-hidden="true"></s>Get in touch / Hire me</div>');
replace('Have something made<em lang="ja">誂える</em>', 'Let’s build something<em lang="ja">誂える</em>');
replace('Every piece starts with the board. Tell us what it is for and\n            we will write back inside the week, with the wood we would cut it from.', escape(data.bio));
replace('<span>Kyoto, Japan</span>', `<span>${escape(data.location)} · Kibori artwork</span>`);
replace('>What are you making?</span>', '>What would you like to build?</span>');
replace('placeholder="A piece, a space, an idea…"', 'placeholder="A role, a project, an idea…"');
replace('Send enquiry<span', 'Open email draft<span');
replace('<p class="status" id="foot-status" role="status"></p>', '<p class="status" id="foot-status" role="status">Opens your email app; nothing is sent automatically.</p>');
const colsStart = html.indexOf('          <div class="cols">');
const colsEnd = html.indexOf('\n          </div>', colsStart);
if (colsStart < 0 || colsEnd < 0) throw new Error('Missing footer details');
html = html.slice(0,colsStart) + `          <div class="cols">
            <div><b>About</b>${escape(data.name)}<br>${escape(data.location)}</div>
            <div><b>Contact</b><a href="mailto:${escape(data.email)}">${escape(data.email)}</a><br><a href="tel:${escape(data.phone)}">${escape(data.phone)}</a></div>
            <div><b>Education</b>${escape(data.education)}</div>
            <div><b>Elsewhere</b>${data.socials.map(s=>link(s.url,s.label)).join('<br>')}<br>${link('/resume.pdf','Source resume')}</div>` + html.slice(colsEnd);
const details = `<section class="portfolio-details" aria-label="Projects, skills, education, and experience">
  <h3>Three projects, eight perspectives</h3><p>The woodcrafts are an illustrated setting for my software projects. Repeated chapters explore different aspects of the same project.</p>
  ${data.projects.map(p=>`<article><h4>${link(p.url,p.title)}</h4><p>${escape(p.description)}</p><p class="tags">${p.tags.map(escape).join(' · ')}</p></article>`).join('')}
  <h3>Skills</h3>${data.skills.map(s=>`<p><b>${escape(s.category)}</b><br>${s.items.map(escape).join(' · ')}</p>`).join('')}
  <h3>Education & experience</h3><p>${escape(data.education)}</p><p>${escape(data.experience)}</p>
  <h3>Certifications</h3><p>${data.certifications.map(escape).join('<br>')}</p><p>Dates and credential verification links: not provided.</p>
  <h3>Coursework</h3><p>${data.coursework.map(escape).join(' · ')}</p>
  <p class="source-note">Project screenshots, live demos, and testimonials: not provided. Source resume contains historical Summer 2026 availability.</p>
</section>`;
replace('        <div class="base">', details+'\n        <div class="base">');
replace('<span>KIBORI <i lang="ja">木彫</i></span>', '<span>RUDRAKSH <i lang="ja">木彫</i></span>');
replace('Back to the workshop', 'Back to the beginning');
replace('<span>© 2026 <i lang="ja">木彫工房</i></span>', `<span>© 2026 ${escape(data.name)} · ThreeUI Kibori</span>`);
replace('Vol. 01 — Winter<span>木彫工房</span>', 'Three projects · Eight chapters<span>木彫工房</span>');
// Preserve validation. Replace the authored demo-only success with an honest mailto handoff.
const formStart = html.indexOf('    /* nothing is posted anywhere from a static page');
const formEnd = html.indexOf("    form.querySelector('button').disabled = true;", formStart)+"    form.querySelector('button').disabled = true;".length;
if(formStart < 0) throw new Error('Missing demo form handler');
html = html.slice(0,formStart) + `    const body = 'From: ' + name + ' <' + mail + '>\\n\\n' + String(f.get('note') || '');
    const draft = 'mailto:${data.email}?subject=' + encodeURIComponent('Portfolio enquiry from ' + name) + '&body=' + encodeURIComponent(body);
    stat.textContent = 'Opening your email app. Review and send the draft there, or use the email link below.';
    const draftLink = document.createElement('a'); draftLink.href = draft; draftLink.target = '_blank'; draftLink.rel = 'noopener';
    draftLink.click();` + html.slice(formEnd);
// A picked-up craft retains its original Japanese label, with project-specific English copy.
replace('  roots = (roots || []).filter(Boolean);', `  const chapter = ${JSON.stringify(data.chapters.map(c=>({title:c.label,note:c.description})))}[station];
  if (chapter) { title = chapter.title; note = chapter.note; }
  roots = (roots || []).filter(Boolean);`);
// Keyboard access to the same authored inspectOpen/inspectClose actions, not a new 3D implementation.
const scriptEnd = html.lastIndexOf('</script>');
html = html.slice(0,scriptEnd) + `
// Portfolio accessibility adapter. Authored scene, raycasting, and drag behavior are retained.
document.addEventListener('click', e => {
  const button = e.target.closest?.('[data-inspect]');
  if (!button) return;
  const entry = INSPECTABLE.find(item => item.station === Number(button.dataset.inspect));
  if (entry) { inspectOpen(entry); }
});
document.addEventListener('keydown', e => {
  if (!INS.open || /INPUT|TEXTAREA/.test(e.target.tagName)) return;
  if (e.key === 'Tab') { e.preventDefault(); inspectEl.querySelector('button').focus({preventScroll:true}); }
  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); INS.yaw += e.key === 'ArrowLeft' ? -0.15 : 0.15; INS.vy = 0; }
  if (e.key === 'ArrowUp' || e.key === 'ArrowDown') { e.preventDefault(); INS.pitch += e.key === 'ArrowUp' ? -0.1 : 0.1; INS.vp = 0; }
});
inspectEl.setAttribute('aria-label', 'Interactive craft. Use arrow keys to turn; Escape to close.');
inspectEl.querySelector('.h span').textContent = 'Drag or use arrow keys to turn';
` + html.slice(scriptEnd);
replace("  INS.entry = e; INS.open = true;", "  INS.returnFocus = document.activeElement;\n  INS.entry = e; INS.open = true;");
replace("  inspectEl.classList.add('on'); inspectEl.setAttribute('aria-hidden', 'false');", "  inspectEl.classList.add('on'); inspectEl.setAttribute('aria-hidden', 'false');\n  inspectEl.querySelector('button').focus({preventScroll:true});");
replace("  inspectEl.classList.remove('on'); inspectEl.setAttribute('aria-hidden', 'true');", "  inspectEl.classList.remove('on'); inspectEl.setAttribute('aria-hidden', 'true');\n  const returnTo = INS.returnFocus?.matches?.('button,a') ? INS.returnFocus : document.querySelector('#ch' + TV.i + ' [data-inspect]');\n  returnTo?.focus({preventScroll:true});");
mkdirSync('public/landing-pages', {recursive:true});
writeFileSync('public/landing-pages/kibori.html', html);
copyFileSync('node_modules/three/build/three.module.min.js', 'public/landing-pages/three.module.min.js');
const sha = value => createHash('sha256').update(value).digest('hex');
const manifest = { canonical: sha(readFileSync('vendor/threeui/kibori.html')), adaptedHtml: sha(html), component: sha(readFileSync('src/shaders/kibori-landing-page/KiboriLandingPage.tsx')), sharedCss: sha(readFileSync('vendor/threeui/threeui.css')), data: sha(readFileSync('src/portfolio-data.json')), three: sha(readFileSync('public/landing-pages/three.module.min.js')) };
writeFileSync('docs/generated-source.json', JSON.stringify(manifest,null,2)+'\n');
console.log('Adapted HTML SHA-256:', manifest.adaptedHtml);
