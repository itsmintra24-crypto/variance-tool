// Renders a /ˈstōik/ LOG carousel as PNG slides in two sizes:
//   carousel-<slug>-<n>.png  1080x1350  (Instagram)
//   tiktok-<slug>-<n>.png    1080x1920  (TikTok, text kept inside the safe area)
//
// usage:  npm install   (once)
//         node render.js logs/log-002.json ../stoic/brand
//
// Text never wraps on its own: every array entry is one line, so line breaks are
// chosen by the writer. The script exits with an error when a line is wider than
// the frame or a slide has too many lines; fix the JSON and run again.
// Headline sizes shrink automatically until they fit.
const fs = require('fs'), path = require('path');
let chromium;
try { ({ chromium } = require('playwright')); }
catch { ({ chromium } = require('/opt/npm-tools/node_modules/playwright')); }

const font = p => 'data:font/woff2;base64,' + fs.readFileSync(path.join(__dirname, 'node_modules', p)).toString('base64');
const BC = w => font(`@fontsource/barlow-condensed/files/barlow-condensed-latin-${w}-normal.woff2`);
const IN = w => font(`@fontsource/inter/files/inter-latin-${w}-normal.woff2`);
const css = `
@font-face{font-family:"Barlow Condensed";font-weight:500;src:url(${BC(500)})}
@font-face{font-family:"Barlow Condensed";font-weight:500;unicode-range:U+0100-02FF;src:url(${font('@fontsource/barlow-condensed/files/barlow-condensed-latin-ext-500-normal.woff2')})}
@font-face{font-family:"Barlow Condensed";font-weight:600;src:url(${BC(600)})}
@font-face{font-family:"Barlow Condensed";font-weight:700;src:url(${BC(700)})}
@font-face{font-family:"Inter";font-weight:300;src:url(${IN(300)})}
@font-face{font-family:"Inter";font-weight:400;src:url(${IN(400)})}
@font-face{font-family:"Inter";font-weight:500;src:url(${IN(500)})}
@font-face{font-family:"Thai";font-weight:100 900;font-stretch:62.5% 100%;unicode-range:U+0E00-0E7F,U+200B-200D,U+25CC;src:url(${font('@fontsource-variable/noto-sans-thai/files/noto-sans-thai-thai-wdth-normal.woff2')})}
*{box-sizing:border-box;margin:0;padding:0}
html,body{background:#090909}
.slide{position:relative;width:1080px;background:#090909;color:#F1EFE9;overflow:hidden;font-family:Inter,sans-serif;-webkit-font-smoothing:antialiased}
.ig{height:1350px} .tt{height:1920px}
.frame{position:absolute;left:120px;right:120px;top:0;height:1350px}
.tt .frame{left:110px;right:200px;top:80px;height:1470px}
.head{position:absolute;top:109px;left:0;right:0;display:flex;justify-content:space-between;font-size:20px;font-weight:500;letter-spacing:.22em;text-transform:uppercase;color:#A5A39D;line-height:26px}
.head span:last-child{margin-right:-.22em}
.foot{position:absolute;bottom:115px;left:0;right:0;display:flex;justify-content:space-between;align-items:flex-end}
.foot .l{font-family:"Barlow Condensed";font-weight:600;font-size:40px;letter-spacing:.02em;line-height:1;text-transform:uppercase;display:inline-flex;align-items:center}
.foot .l svg{margin-left:16px;position:relative;top:4px}
.foot .r{position:relative;top:3px;font-size:24px;letter-spacing:.06em;color:#A5A39D;line-height:1.3}
.foot .wm{font-family:"Barlow Condensed";font-weight:500;font-size:58px;letter-spacing:-.01em;line-height:1;display:inline-flex;align-items:baseline;text-transform:none}
.wm-tick{display:inline-block;width:.055em;height:.32em;background:currentColor;margin:0 .06em 0 .05em;transform:translateY(-.42em)}
.th{font-family:"Thai",Inter,sans-serif;font-stretch:75%}
.body{position:absolute;left:0;right:0;top:50%;transform:translateY(-50%)}
.tt .body{margin-top:14px}
.body div{white-space:nowrap}
.no{font-family:"Barlow Condensed";font-weight:600;font-size:48px;letter-spacing:.04em;color:#A5A39D;line-height:1;margin-bottom:44px}
.h{font-family:"Barlow Condensed";font-weight:700;text-transform:uppercase;letter-spacing:0;font-size:var(--hs);line-height:calc(var(--hs) * .938)}
.rule{width:96px;height:3px;background:#F1EFE9;margin-bottom:51px}
.t1{font-size:62px;color:#A5A39D;line-height:1.2;margin-top:36px}
.t4{font-size:62px;color:#F1EFE9;line-height:1.2;margin-top:35px}
.t7{font-size:54px;color:#F1EFE9;line-height:1.3;margin-top:52px}
.p{font-weight:300;font-size:63.3px;line-height:78px;letter-spacing:.005em}
.m{color:#A5A39D}
.t2{font-size:42px;line-height:64px;color:#C9C7C1;margin-top:28px}
.tb{font-size:60px;line-height:90px;color:#F1EFE9}
.tb.m,.tb .m{color:#A5A39D}
.lab{font-size:36px;line-height:1.3;color:#A5A39D;margin-bottom:10px}
.shift .rule{margin:54px 0 50px}
.p5{font-weight:300;font-size:46px;line-height:56px;margin-top:62px;letter-spacing:.005em}
.t5{font-size:38px;line-height:54px;color:#A5A39D;margin-top:24px}
`;
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const lines = (a, cls = '') => (a || []).map(l => `<div class="${cls}">${esc(l)}</div>`).join('');
const ARROW = '<svg width="30" height="16" viewBox="0 0 30 16" fill="none" stroke="currentColor" stroke-width="2"><path d="M0 8h28M21 1.5 28 8l-7 6.5"/></svg>';
const WORDMARK = '<span class="wm">/<span class="wm-tick"></span>stōik/</span>';
// Default headline size per slide type; shrunk automatically when it does not fit.
const HEAD = { hook: 186, turn: 222, closing: 147 };

function slide(d, s, i, kind, hs) {
  const n = String(i + 1).padStart(2, '0'), N = String(d.slides.length).padStart(2, '0');
  const last = s.type === 'closing';
  const head = `<div class="head"><span>${last || !d.stamp ? 'THE LOG' : 'THE LOG · ' + esc(d.stamp)}</span><span>${n} / ${N}</span></div>`;
  let body = '', footL = esc(d.no), footR = esc(d.handle);
  if (s.type === 'hook') { body = `<div class="no">${esc(d.no)}</div><div class="h">${lines(s.en)}</div><div class="th t1">${lines(s.th)}</div>`; footL = 'SWIPE' + ARROW; }
  else if (s.type === 'thai') body = `<div class="th tb">${lines(s.th)}${lines(s.th2, 'm')}</div>`;
  else if (s.type === 'text') body = `<div class="p">${lines(s.en)}${lines(s.en2, 'm')}</div><div class="th t2">${lines(s.th)}</div>`;
  else if (s.type === 'turn') body = `<div class="rule"></div><div class="h">${lines(s.en)}</div><div class="th t4">${lines(s.th)}</div>`;
  else if (s.type === 'shift') body = `<div class="th shift"><div class="lab">${esc(s.fromLabel || 'แทนที่จะคิดว่า')}</div><div class="tb m">${lines(s.from)}</div><div class="rule"></div><div class="lab">${esc(s.toLabel || 'ให้คิดว่า')}</div><div class="tb">${lines(s.to)}</div></div>`;
  else if (s.type === 'closing') {
    body = `<div class="h">${lines(s.en)}</div>${s.sub ? `<div class="p5">${lines(s.sub)}</div>` : ''}<div class="th ${s.sub ? 't5' : 't7'}">${lines(s.th)}</div>`;
    footL = WORDMARK;
    if (s.cta) footR = `${esc(s.cta)}${s.ctaTh ? ` · <span class="th">${esc(s.ctaTh)}</span>` : ''}`;
  } else throw new Error(`slide ${i + 1}: unknown type "${s.type}"`);
  return `<!doctype html><meta charset="utf-8"><style>${css}</style><div class="slide ${kind}" style="--hs:${hs}px"><div class="frame">${head}<div class="body">${body}</div><div class="foot"><span class="l">${footL}</span><span class="r">${footR}</span></div></div></div>`;
}

const measure = () => {
  const f = document.querySelector('.frame').getBoundingClientRect(), wide = [];
  document.querySelectorAll('.body div, .foot span').forEach(e => {
    if (e.children.length && !e.matches('.l,.r,.wm')) return;
    const r = document.createRange(); r.selectNodeContents(e);
    const over = Math.round(r.getBoundingClientRect().right - f.right);
    if (over > 1) wide.push({ text: e.textContent, over, headline: !!e.closest('.h') });
  });
  const bd = document.querySelector('.body').getBoundingClientRect(), hd = document.querySelector('.head').getBoundingClientRect(), ft = document.querySelector('.foot').getBoundingClientRect();
  return { wide, gap: Math.round(Math.min(bd.top - hd.bottom, ft.top - bd.bottom)) };
};

(async () => {
  const [src, out] = process.argv.slice(2);
  if (!src || !out) { console.error('usage: node render.js <log.json> <output-dir>'); process.exit(2); }
  const d = JSON.parse(fs.readFileSync(src, 'utf8'));
  fs.mkdirSync(out, { recursive: true });
  const FORMATS = [['ig', 'carousel', 1350], ['tt', 'tiktok', 1920]];
  const MIN_GAP = 100, problems = [];
  const b = await chromium.launch();
  const pages = {};
  for (const [kind, , h] of FORMATS) pages[kind] = await b.newPage({ viewport: { width: 1080, height: h } });
  const load = async (kind, html) => { const p = pages[kind]; await p.setContent(html); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(120); return p.evaluate(measure); };

  for (let i = 0; i < d.slides.length; i++) {
    const s = d.slides[i];
    let hs = s.size || HEAD[s.type] || 0;
    // Shrink the headline until it fits both formats, so both sizes look the same.
    for (; hs > 96; hs -= 4) {
      let ok = true;
      for (const [kind] of FORMATS) { const m = await load(kind, slide(d, s, i, kind, hs)); if (m.wide.some(w => w.headline) || m.gap < MIN_GAP) ok = false; }
      if (ok || !HEAD[s.type]) break;
    }
    for (const [kind, prefix] of FORMATS) {
      const m = await load(kind, slide(d, s, i, kind, hs));
      for (const w of m.wide) problems.push(`slide ${i + 1} (${prefix}): line too wide by ${w.over}px, break it earlier: "${w.text}"`);
      if (m.gap < 60) problems.push(`slide ${i + 1} (${prefix}): too many lines, only ${m.gap}px of breathing room. Cut text.`);
      await pages[kind].screenshot({ path: path.join(out, `${prefix}-${d.slug}-${i + 1}.png`) });
    }
    console.log(`slide ${i + 1} ${s.type}${HEAD[s.type] ? ' headline ' + hs + 'px' : ''}`);
  }
  await b.close();
  if (problems.length) { console.error('\nNOT READY TO POST:\n' + problems.join('\n')); process.exit(1); }
  console.log(`\nok: ${d.slides.length} slides x 2 sizes written to ${out}`);
})();
