#!/usr/bin/env node
// The YouTube thumbnail for the single full-course film (scripts/out/film.mp4).
//
// Not the shell's `graphl-thumb`: that template is a PER-COURSE poster (58% scene + panel), and a
// cropped 16:9 video frame turns to mush at the ~168px the mobile feed actually renders. A film
// cover needs poster grammar — few elements, enormous type, one focal object.
//
// The terminal card is REAL: every row is cut out of a spine session.txt, the same replayed output
// the scenes use, so the thumbnail cannot promise an app the course does not build.

import { mkdirSync, readFileSync, writeFileSync, existsSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, dirname, isAbsolute } from 'node:path'
import { execFile } from 'node:child_process'
import { createRequire } from 'node:module'
import { pathToFileURL } from 'node:url'
import { promisify } from 'node:util'

const run = promisify(execFile)
const repoDir = process.cwd()
const dataDir = join(repoDir, 'scripts')
const FFMPEG = ['/opt/homebrew/bin/ffmpeg', '/usr/local/bin/ffmpeg'].find(existsSync) ?? 'ffmpeg'
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const SCALE = 2
const W = 1280 * SCALE
const H = 720 * SCALE

// ── the real output ─────────────────────────────────────────────────────────────────────────────
const SESSION = join(repoDir, 'spine', 'ship', '04-the-finished-app', 'session.txt')
const REPL = join(repoDir, 'spine', 'hold', '02-decimal', 'session.txt')

/**
 * Cut the REPL transcript out of §3.2: `0.1 + 0.2`, the answer that surprises everyone, and the
 * Decimal that fixes it. Every line is the session's — the prompts, the echoes, the exact digits.
 * It is the most recognisable thing a Python screen can show, and it is this course's own lesson:
 * why money is a Decimal.
 */
function realRepl() {
  const lines = readFileSync(REPL, 'utf8').split('\n').map((l) => l.trimEnd())
  const start = lines.findIndex((l) => /^\$ python/.test(l))
  if (start < 0) throw new Error(`no python command in ${REPL}`)
  const cmd = lines[start].replace(/^\$ /, '')

  // Pair each `>>> expr` with the line the interpreter echoed back (a statement echoes nothing).
  const steps = []
  for (let i = start + 1; i < lines.length && !lines[i].startsWith('$'); i++) {
    const m = lines[i].match(/^>>> (.+)$/)
    if (!m || m[1] === 'exit()') continue
    const next = lines[i + 1] ?? ''
    steps.push({ expr: m[1], out: /^>>> |^\$/.test(next) || !next ? null : next })
  }
  if (!steps.length) throw new Error(`no >>> lines in ${REPL}`)

  // One line of this session prints Decimal(0.1) in full — 55 digits. It is a real and wonderful
  // result, and it cannot be set in poster type without shrinking the whole card to nothing, so
  // lines with an output too long to render are left out rather than truncated. Nothing shown is
  // altered; the cover just shows fewer steps than the session ran.
  const MAX_OUT = 34
  const shown = steps.filter((s) => !s.out || s.out.length <= MAX_OUT)

  const hero = steps.find((s) => s.out && /^0\.30{5,}/.test(s.out))
  if (!hero) throw new Error('no float-surprise line (0.1 + 0.2) in the REPL session')
  const fixed = steps.find((s) => s.out && /^Decimal\('0\.3'\)$/.test(s.out))
  if (!fixed) throw new Error("no Decimal('0.3') line in the REPL session")

  if (!shown.includes(hero) || !shown.includes(fixed)) {
    throw new Error('the float surprise or its Decimal fix is too long to render — check the session')
  }
  return { cmd, steps, shown, hero, fixed }
}

/** Cut the report out of the session: its command line, and the rows we show. */
function realReport(rows) {
  const lines = readFileSync(SESSION, 'utf8').split('\n')
  const i = lines.findIndex((l) => /^\$ .*expense_tracker report\s*$/.test(l))
  if (i < 0) throw new Error(`no 'expense_tracker report' command in ${SESSION}`)
  const cmd = lines[i].replace(/^\$ /, '')
  const body = []
  for (let j = i + 1; j < lines.length && !lines[j].startsWith('$'); j++) body.push(lines[j].trimEnd())
  const header = body[0]
  // `fun  96.29  60.00  ##########  160% over`
  const parsed = body.slice(1).filter(Boolean).map((l) => {
    const m = l.match(/^(\S+)\s+([\d.]+)\s+([\d.]+)\s+(#*)\s+(\d+)%\s*(\w*)$/)
    if (!m) throw new Error(`unparsed report row: "${l}"`)
    return { cat: m[1], spent: m[2], budget: m[3], bar: m[4], pct: +m[5], flag: m[6] }
  })
  const want = parsed.filter((r) => rows.includes(r.cat))
  const missing = rows.filter((c) => !want.some((r) => r.cat === c))
  if (missing.length) throw new Error(`rows not in the real report: ${missing.join(', ')}`)
  return { cmd, header, rows: want.sort((a, b) => rows.indexOf(a.cat) - rows.indexOf(b.cat)) }
}

// ── the page ────────────────────────────────────────────────────────────────────────────────────
const fontFace = (fam, weight, file) => {
  const b64 = readFileSync(join(repoDir, 'node_modules', '@fontsource', fam, 'files', file)).toString('base64')
  return `@font-face{font-family:'${fam === 'ibm-plex-mono' ? 'IBM Plex Mono' : 'IBM Plex Sans'}';`
    + `font-weight:${weight};font-style:normal;font-display:block;`
    + `src:url(data:font/woff2;base64,${b64}) format('woff2')}`
}

// The scene engine's tone palette (@graphlearning/graphl-flow), its dark row — the card is dark in
// every theme. Using these instead of invented colours paints the cover like the scenes.
const TONE = {
  neutral: { accent: '#9aa4b2', tint: '#181b20' },
  ingest:  { accent: '#4f8ff7', tint: '#111d2e' },
  store:   { accent: '#37b877', tint: '#122419' },
  serve:   { accent: '#c98bff', tint: '#1e1428' },
  consume: { accent: '#f0656f', tint: '#2a1416' },
  infra:   { accent: '#f0902f', tint: '#241c12' },
}

const THEMES = {
  dark:  { badgeInk: '#10141f', bg: '#0b1020', card: '#141c30', ink: '#ffffff', accent: '#ffd43b', rule: 'rgba(255,255,255,.14)',
           glow: 'radial-gradient(120% 120% at 8% 10%, #16233f 0%, #0b1020 60%)' },
  navy:  { badgeInk: '#0f141a', bg: '#0f141a', card: '#182434', ink: '#ffffff', accent: '#ffd43b', rule: 'rgba(255,255,255,.12)',
           glow: 'radial-gradient(130% 110% at 85% 15%, #1d3a5c 0%, #0f141a 62%)' },
  light: { badgeInk: '#ffffff', bg: '#f4f6fa', card: '#161d2b', ink: '#0d1220', accent: '#2f6fb0', rule: 'rgba(0,0,0,.12)',
           glow: 'radial-gradient(120% 120% at 10% 8%, #ffffff 0%, #e7ecf5 70%)' },
}

function pageHtml({ report, repl, uses, theme, head1, head2, badge, mark }) {
  const t = THEMES[theme]
  const fonts = [
    fontFace('ibm-plex-sans', 700, 'ibm-plex-sans-latin-700-normal.woff2'),
    fontFace('ibm-plex-sans', 600, 'ibm-plex-sans-latin-600-normal.woff2'),
    fontFace('ibm-plex-mono', 600, 'ibm-plex-mono-latin-600-normal.woff2'),
    fontFace('ibm-plex-mono', 400, 'ibm-plex-mono-latin-400-normal.woff2'),
  ].join('')

  // One grid for the whole table, so every column lines up across rows and nothing can collide.
  const cells = (report?.rows ?? []).map((r) => {
    const over = r.flag === 'over'
    const barCol = over ? '#ff5c5c' : r.flag === 'careful' ? t.accent : '#4aa3ff'
    const pctCol = over ? '#ff7a7a' : r.flag === 'careful' ? t.accent : 'rgba(255,255,255,.75)'
    return `<span class="cat${over ? ' hot' : ''}">${esc(r.cat)}</span>`
      + `<span class="num">${esc(r.spent)}</span>`
      + `<span class="bar"><i style="width:${Math.min(100, r.pct)}%;background:${barCol}"></i></span>`
      + `<span class="pct" style="color:${pctCol}">${r.pct}%</span>`
      + `<span class="flag" style="color:${pctCol}">${esc(r.flag)}</span>`
  }).join('')

  return `<style>
  ${fonts}
  *{box-sizing:border-box;margin:0;padding:0}
  html,body{width:${W}px;height:${H}px;overflow:hidden}
  body{background:${t.bg};background-image:${t.glow};
       font-family:'IBM Plex Sans',system-ui,sans-serif;color:${t.ink};
       display:flex;align-items:stretch;gap:${40 * SCALE}px;padding:${46 * SCALE}px ${50 * SCALE}px}

  .left{flex:0 0 auto;max-width:${540 * SCALE}px;display:flex;flex-direction:column;justify-content:center}
  .markwrap{display:flex;align-items:flex-start;gap:${5 * SCALE}px;align-self:flex-start;
            margin-bottom:${16 * SCALE}px}
  .markwrap .logo{margin-bottom:0}
  /* Theme-aware: the policy asks for a TM beside the logo, and a white one on the light
     background would be a TM that is not there. */
  .tm{font-family:'IBM Plex Sans',system-ui,sans-serif;font-size:${22 * SCALE}px;font-weight:600;
      color:${theme === 'light' ? 'rgba(0,0,0,.5)' : 'rgba(255,255,255,.55)'};line-height:1}
  .logo{width:${104 * SCALE}px;height:${104 * SCALE}px;display:block;margin-bottom:${16 * SCALE}px;
        align-self:flex-start}

  .uses{flex:1;min-width:0;display:grid;grid-template-columns:1fr 1fr;align-content:center;
        column-gap:${22 * SCALE}px;row-gap:${20 * SCALE}px;margin:${10 * SCALE}px 0}
  .use{display:flex;align-items:flex-start;gap:${11 * SCALE}px;min-width:0}
  .ico{width:${30 * SCALE}px;height:${30 * SCALE}px;flex:0 0 auto;margin-top:${2 * SCALE}px}
  .usetext{min-width:0}
  .usetitle{font-family:'IBM Plex Sans',system-ui,sans-serif;font-weight:700;
            font-size:${25 * SCALE}px;color:#ffffff;letter-spacing:-.01em;white-space:nowrap}
  .usesub{font-family:'IBM Plex Sans',system-ui,sans-serif;font-size:${22 * SCALE}px;
          color:rgba(255,255,255,.56);margin-top:${2 * SCALE}px;white-space:nowrap}
  .h{font-weight:700;line-height:.85;letter-spacing:-.05em;font-size:${116 * SCALE}px;white-space:nowrap}
  .h2{color:${t.accent}}
  .badge{align-self:flex-start;margin-top:${26 * SCALE}px;padding:${11 * SCALE}px ${24 * SCALE}px;
         background:${t.accent};border-radius:${12 * SCALE}px;
         font-weight:700;font-size:${34 * SCALE}px;letter-spacing:.06em;color:${t.badgeInk}}

  .card{flex:1;min-width:0;background:${t.card};border:${1 * SCALE}px solid ${t.rule};
        border-radius:${18 * SCALE}px;padding:${26 * SCALE}px ${30 * SCALE}px ${24 * SCALE}px;
        display:flex;flex-direction:column;box-shadow:0 ${22 * SCALE}px ${64 * SCALE}px rgba(0,0,0,.5)}
  .dots{display:flex;gap:${9 * SCALE}px;margin-bottom:${18 * SCALE}px}
  .dots i{width:${13 * SCALE}px;height:${13 * SCALE}px;border-radius:50%}
  .cmd{font-family:'IBM Plex Mono',monospace;font-size:${26 * SCALE}px;font-weight:400;
       color:rgba(255,255,255,.66);margin-bottom:${14 * SCALE}px;white-space:nowrap}
  .cmd b{color:#6ee787;font-weight:400}

  .rows{flex:1;display:grid;align-content:center;
        grid-template-columns:auto auto 1fr auto auto;
        column-gap:${13 * SCALE}px;row-gap:${26 * SCALE}px;
        font-family:'IBM Plex Mono',monospace;font-weight:600;font-size:${33 * SCALE}px;color:#fff}
  .cat{letter-spacing:-.02em}
  .cat.hot{color:#ff7a7a}
  .num{color:rgba(255,255,255,.82);text-align:right}
  .bar{height:${23 * SCALE}px;min-width:${120 * SCALE}px;border-radius:${12 * SCALE}px;
       background:rgba(255,255,255,.1);overflow:hidden;align-self:center}
  .bar i{display:block;height:100%;border-radius:${11 * SCALE}px}
  .pct{text-align:right;white-space:nowrap}
  .flag{white-space:nowrap;font-size:${26 * SCALE}px}

  .repl{flex:1;min-width:0;overflow:hidden;display:flex;flex-direction:column;
        justify-content:center;gap:${9 * SCALE}px;
        font-family:'IBM Plex Mono',monospace;font-size:${29 * SCALE}px;white-space:nowrap}
  .line{color:#ffffff;font-weight:600}
  .ps1{color:${TONE.store.accent};margin-right:${10 * SCALE}px;font-weight:400}
  .out{color:rgba(255,255,255,.62);font-weight:400;padding-left:${4 * SCALE}px}
  .out.bad{color:${TONE.consume.accent};font-weight:600}
  .out.good{color:${TONE.store.accent};font-weight:600}
  .stat2{font-family:'IBM Plex Sans',system-ui,sans-serif;font-weight:700;
         font-size:${40 * SCALE}px;color:#ffffff;letter-spacing:-.02em;white-space:nowrap}
  .stat{font-family:'IBM Plex Mono',monospace;font-weight:600;font-size:${46 * SCALE}px;
        color:${TONE.consume.accent};letter-spacing:-.02em;white-space:nowrap}
  .statsub{font-family:'IBM Plex Mono',monospace;font-size:${26 * SCALE}px;
           color:rgba(255,255,255,.55);margin-top:${6 * SCALE}px;white-space:nowrap}
  .foot{margin-top:${20 * SCALE}px;white-space:nowrap;font-family:'IBM Plex Mono',monospace;font-size:${24 * SCALE}px;
        color:rgba(255,255,255,.4);letter-spacing:.04em}
</style>
<div class="left">
  ${markSvg(t, theme, mark)}
  <div class="h">${esc(head1)}</div>
  ${head2.split(/\s+/).map((w) => `<div class="h h2">${esc(w)}</div>`).join('')}
  <div class="badge">${esc(badge)}</div>
</div>
<div class="card">
  <div class="dots"><i style="background:#ff5f57"></i><i style="background:#febc2e"></i><i style="background:#28c840"></i></div>
  ${uses
    ? `<div class="stat2">${esc(uses.title)}</div>
       <div class="uses">${usesHtml(uses)}</div>
       <div class="foot">one language · one real app, built in it</div>`
    : repl
    ? `<div class="cmd">$ <b>${esc(repl.cmd)}</b></div>
       <div class="stat">${esc(repl.hero.out)}</div>
       <div class="statsub">&gt;&gt;&gt; ${esc(repl.hero.expr)}</div>
       <div class="repl">${replHtml(repl)}</div>
       <div class="foot">why money is a Decimal</div>`
    : `<div class="cmd">$ <b>${esc(report.cmd)}</b></div>
       <div class="rows">${cells}</div>
       <div class="foot">${esc(report.header.trim().split(/\s+/)[0])} · spent vs budget</div>`}
</div>`
}

/**
 * The repo's own mark — NOT the Python two-snake logo. That is a PSF trademark: the PSF allows
 * non-commercial promotion and nominative use, but "any other commercial uses require prior
 * written permission", and a monetised channel is commercial. (The sister data-science repo *does*
 * carry the real pandas logo, because pandas publishes it under BSD-3 — a copyright licence that
 * says yes. Copyright and trademark are different questions, answered per project.)
 *
 * So: the REPL prompt. It is the most Python thing on any screen, it belongs to nobody, and it is
 * literally what the card beside it shows.
 */
function markSvg(t, theme, mark) {
  if (mark === 'glyph') {
    // Our own: the REPL prompt. Owned by nobody, and exactly what the sister Spark cover does.
    const ink = theme === 'light' ? t.accent : '#ffffff'
    const chevron = (x) => `<path d="M${x} 19 L${x + 13} 32 L${x} 45" fill="none" stroke="${ink}"
      stroke-width="6.6" stroke-linecap="round" stroke-linejoin="round"/>`
    return `<svg class="logo" viewBox="0 0 64 64" role="img" aria-label="Python — GraphL"
      xmlns="http://www.w3.org/2000/svg">${chevron(8)}${chevron(24)}${chevron(40)}</svg>`
  }
  // The PSF logo, UNALTERED and with the TM its policy asks for. See
  // public/vendor/NOTICE-python-logo.txt — a monetised channel is a commercial use and needs the
  // PSF's prior written permission; `--mark glyph` is the build that needs no one's permission.
  const raw = readFileSync(join(repoDir, 'public', 'vendor', 'python-logo-notext.svg'), 'utf8')
  const body = raw.slice(raw.indexOf('>', raw.indexOf('<svg')) + 1, raw.lastIndexOf('</svg>'))
  const vb = raw.match(/viewBox="([^"]+)"/)?.[1] ?? '0 0 110 110'
  return `<span class="markwrap"><svg class="logo" viewBox="${vb}" role="img" aria-label="Python"
    xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">${body}</svg>`
    + `<span class="tm">&#8482;</span></span>`
}

// ── the course's own use-case grid ───────────────────────────────────────────────────────────────
// Read from src/scenes/intro/index.ts through the same registry the checks use, so the cover shows
// the course's list, not a retyped one: change the scene and the thumbnail follows.
async function realUses() {
  const { loadRegistry, nodesOf } = await import(pathToFileURL(join(repoDir, 'scripts', 'registry.mjs')).href)
  const reg = await loadRegistry()
  for (const scene of Object.values(reg.SCENES)) {
    const hit = nodesOf(scene).find(({ node }) => node.id === 'uses')
    if (!hit) continue
    const items = (hit.node.children ?? []).filter((c) => c.type === 'item')
    if (!items.length) throw new Error('the "uses" group has no items')
    return { title: hit.node.title, items }
  }
  throw new Error('no scene contains a group with id "uses" — has src/scenes/intro changed?')
}

/** The app's own icons: lucide's geometry (ISC) and graphl-flow's bundled brand marks. */
function iconSvg(name, colour) {
  const lucide = join(repoDir, 'node_modules', 'lucide-react', 'dist', 'esm', 'icons', `${name}.mjs`)
  if (existsSync(lucide)) {
    const nodes = [...readFileSync(lucide, 'utf8').matchAll(/\[\s*"(\w+)",\s*\{([^}]*)\}\s*\]/g)]
      .map((m) => {
        const attrs = [...m[2].matchAll(/(\w+):\s*"([^"]*)"/g)]
          .filter(([, k]) => k !== 'key').map(([, k, v]) => `${k}="${v}"`).join(' ')
        return `<${m[1]} ${attrs}/>`
      }).join('')
    if (!nodes) throw new Error(`no geometry in lucide icon "${name}"`)
    return `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="${colour}" stroke-width="2"
      stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">${nodes}</svg>`
  }
  // pandas and jupyter are not lucide icons; graphl-flow bundles their paths, so take them there.
  const engine = readFileSync(join(repoDir, 'node_modules', '@graphlearning', 'graphl-flow', 'dist', 'index.js'), 'utf8')
  const at = engine.indexOf(`"${name}"`)
  if (at < 0) throw new Error(`icon "${name}" is neither a lucide icon nor bundled by graphl-flow`)
  const d = engine.slice(at, at + 2000).match(/path:\s*"([^"]+)"/)?.[1]
  if (!d) throw new Error(`no path for bundled icon "${name}"`)
  return `<svg class="ico" viewBox="0 0 24 24" fill="${colour}"
    xmlns="http://www.w3.org/2000/svg"><path d="${d}"/></svg>`
}

/** Brand marks keep their own colour; everything else takes the group's tone, as in the scene. */
const ICON_COLOUR = { pandas: '#ffffff', jupyter: '#f37626' }

function usesHtml(uses) {
  return uses.items.map((it) => `<div class="use">
      ${iconSvg(it.icon, ICON_COLOUR[it.icon] ?? TONE.store.accent)}
      <div class="usetext"><div class="usetitle">${esc(it.title)}</div>`
    + (it.sub ? `<div class="usesub">${esc(it.sub)}</div>` : '')
    + `</div></div>`).join('')
}

/** The REPL as the card: prompts, expressions, and the exact values the interpreter echoed back. */
function replHtml(r) {
  // The hero line is the headline already — repeating it below would waste the card.
  return r.shown.filter((s) => s !== r.hero).map((s) => {
    const surprise = s === r.hero
    const fixed = s === r.fixed
    const out = s.out
      ? `<div class="out${surprise ? ' bad' : fixed ? ' good' : ''}">${esc(s.out)}</div>` : ''
    return `<div class="line"><span class="ps1">&gt;&gt;&gt;</span>${esc(s.expr)}</div>${out}`
  }).join('')
}

// ── render ──────────────────────────────────────────────────────────────────────────────────────
async function main() {
  const argv = process.argv.slice(2)
  const opt = { theme: 'dark', out: 'output/thumbnails/film.png', source: 'uses', mark: 'logo',
                head1: 'LEARN', head2: 'PYTHON', badge: 'FULL COURSE',
                rows: ['fun', 'food', 'transport'] }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--theme') opt.theme = argv[++i]
    else if (a === '--out') opt.out = argv[++i]
    else if (a === '--head1') opt.head1 = argv[++i]
    else if (a === '--head2') opt.head2 = argv[++i]
    else if (a === '--badge') opt.badge = argv[++i]
    else if (a === '--rows') opt.rows = argv[++i].split(',')
    else if (a === '--source') opt.source = argv[++i]
    else if (a === '--mark') opt.mark = argv[++i]
    else { console.error(`unknown argument: ${a}`); process.exit(2) }
  }
  if (!THEMES[opt.theme]) { console.error(`unknown theme: ${opt.theme} (have: ${Object.keys(THEMES).join(', ')})`); process.exit(2) }

  if (!['uses', 'repl', 'report'].includes(opt.source)) {
    console.error(`unknown source: ${opt.source} (have: uses, repl, report)`); process.exit(2)
  }
  if (!['logo', 'glyph'].includes(opt.mark)) {
    console.error(`unknown mark: ${opt.mark} (have: logo, glyph)`); process.exit(2)
  }
  const uses = opt.source === 'uses' ? await realUses() : null
  const repl = opt.source === 'repl' ? realRepl() : null
  const report = opt.source === 'report' ? realReport(opt.rows) : null
  if (uses) {
    console.log(`Real scene from src/scenes/intro: "${uses.title}"`)
    for (const it of uses.items) console.log(`  ${it.icon.padEnd(9)} ${it.title}${it.sub ? ` — ${it.sub}` : ''}`)
    if (opt.mark === 'logo') console.log('\nMark: the PSF Python logo + TM — see public/vendor/NOTICE-python-logo.txt')
  } else if (repl) {
    console.log(`Real REPL from spine: $ ${repl.cmd}`)
    for (const st of repl.steps) console.log(`  >>> ${st.expr}${st.out ? `\n      ${st.out}` : ''}`)
  } else {
    console.log(`Real report from spine: $ ${report.cmd}`)
    for (const r of report.rows) console.log(`  ${r.cat.padEnd(10)} ${r.spent.padStart(7)} / ${r.budget.padStart(7)}  ${r.pct}% ${r.flag}`)
  }

  const requireFromRepo = createRequire(join(repoDir, 'package.json'))
  const { default: puppeteer } = await import(pathToFileURL(requireFromRepo.resolve('puppeteer')).href)

  const browser = await puppeteer.launch({ headless: true,
    defaultViewport: { width: W, height: H, deviceScaleFactor: 1 }, args: [`--window-size=${W},${H}`] })
  try {
    const page = await browser.newPage()
    await page.setContent(pageHtml({ report, repl, uses, ...opt }), { waitUntil: 'load' })
    await page.evaluate(() => document.fonts.ready)
    await sleep(250)

    const overflow = await page.evaluate(() => {
      const bad = []
      for (const sel of ['.rows', '.card', '.left', 'body']) {
        const el = document.querySelector(sel)
        if (el && (el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 1)) {
          bad.push(`${sel} ${el.scrollWidth}x${el.scrollHeight} > ${el.clientWidth}x${el.clientHeight}`)
        }
      }
      // any element whose right edge runs past the viewport is clipped
      for (const el of document.querySelectorAll('.cat,.num,.pct,.flag,.cmd,.h,.badge,.stat,.stat2,.statsub,.line,.out,.usetitle,.usesub')) {
        const r = el.getBoundingClientRect()
        if (r.right > window.innerWidth + 1 || r.bottom > window.innerHeight + 1) {
          bad.push(`clipped: "${el.textContent.trim().slice(0, 18)}" right=${Math.round(r.right)}`)
        }
      }
      return bad
    })
    if (overflow.length) throw new Error(`layout overflows:\n  ${overflow.join('\n  ')}`)
    const out = isAbsolute(opt.out) ? opt.out : join(repoDir, opt.out)
    mkdirSync(dirname(out), { recursive: true })
    const big = join(tmpdir(), `thumb-film-${Date.now()}.png`)
    await page.screenshot({ path: big })
    await run(FFMPEG, ['-y', '-loglevel', 'error', '-i', big, '-vf', 'scale=1280:720:flags=lanczos', out])
    rmSync(big, { force: true })
    console.log(`\n✅ ${out}  (${opt.theme})`)
  } finally {
    await browser.close()
  }
}

main().catch((e) => { console.error('\n✗', e.message); process.exit(1) })
