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

const THEMES = {
  dark:  { badgeInk: '#10141f', bg: '#0b1020', card: '#141c30', ink: '#ffffff', accent: '#ffd43b', rule: 'rgba(255,255,255,.14)',
           glow: 'radial-gradient(120% 120% at 8% 10%, #16233f 0%, #0b1020 60%)' },
  navy:  { badgeInk: '#0f141a', bg: '#0f141a', card: '#182434', ink: '#ffffff', accent: '#ffd43b', rule: 'rgba(255,255,255,.12)',
           glow: 'radial-gradient(130% 110% at 85% 15%, #1d3a5c 0%, #0f141a 62%)' },
  light: { badgeInk: '#ffffff', bg: '#f4f6fa', card: '#161d2b', ink: '#0d1220', accent: '#2f6fb0', rule: 'rgba(0,0,0,.12)',
           glow: 'radial-gradient(120% 120% at 10% 8%, #ffffff 0%, #e7ecf5 70%)' },
}

function pageHtml({ report, theme, head1, head2, badge }) {
  const t = THEMES[theme]
  const fonts = [
    fontFace('ibm-plex-sans', 700, 'ibm-plex-sans-latin-700-normal.woff2'),
    fontFace('ibm-plex-sans', 600, 'ibm-plex-sans-latin-600-normal.woff2'),
    fontFace('ibm-plex-mono', 600, 'ibm-plex-mono-latin-600-normal.woff2'),
    fontFace('ibm-plex-mono', 400, 'ibm-plex-mono-latin-400-normal.woff2'),
  ].join('')

  // One grid for the whole table, so every column lines up across rows and nothing can collide.
  const cells = report.rows.map((r) => {
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

  .left{flex:0 0 auto;display:flex;flex-direction:column;justify-content:center}
  .logo{width:${92 * SCALE}px;height:${92 * SCALE}px;display:block;margin-bottom:${18 * SCALE}px;
        border-radius:${20 * SCALE}px}
  .h{font-weight:700;line-height:.85;letter-spacing:-.05em;font-size:${116 * SCALE}px}
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

  .foot{margin-top:${20 * SCALE}px;font-family:'IBM Plex Mono',monospace;font-size:${24 * SCALE}px;
        color:rgba(255,255,255,.4);letter-spacing:.04em}
</style>
<div class="left">
  ${logoSvg()}
  <div class="h">${esc(head1)}</div>
  <div class="h h2">${esc(head2)}</div>
  <div class="badge">${esc(badge)}</div>
</div>
<div class="card">
  <div class="dots"><i style="background:#ff5f57"></i><i style="background:#febc2e"></i><i style="background:#28c840"></i></div>
  <div class="cmd">$ <b>${esc(report.cmd)}</b></div>
  <div class="rows">${cells}</div>
  <div class="foot">${esc(report.header.trim().split(/\s+/)[0])} · spent vs budget</div>
</div>`
}

/** The repo's own brand tile (public/favicon.svg), so the thumbnail matches the site. */
function logoSvg() {
  const raw = readFileSync(join(repoDir, 'public', 'favicon.svg'), 'utf8')
  return raw.replace('<svg ', '<svg class="logo" ')
}

// ── render ──────────────────────────────────────────────────────────────────────────────────────
async function main() {
  const argv = process.argv.slice(2)
  const opt = { theme: 'dark', out: 'output/thumbnails/film.png',
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
    else { console.error(`unknown argument: ${a}`); process.exit(2) }
  }
  if (!THEMES[opt.theme]) { console.error(`unknown theme: ${opt.theme} (have: ${Object.keys(THEMES).join(', ')})`); process.exit(2) }

  const report = realReport(opt.rows)
  console.log(`Real report from spine: $ ${report.cmd}`)
  for (const r of report.rows) console.log(`  ${r.cat.padEnd(10)} ${r.spent.padStart(7)} / ${r.budget.padStart(7)}  ${r.pct}% ${r.flag}`)

  const requireFromRepo = createRequire(join(repoDir, 'package.json'))
  const { default: puppeteer } = await import(pathToFileURL(requireFromRepo.resolve('puppeteer')).href)

  const browser = await puppeteer.launch({ headless: true,
    defaultViewport: { width: W, height: H, deviceScaleFactor: 1 }, args: [`--window-size=${W},${H}`] })
  try {
    const page = await browser.newPage()
    await page.setContent(pageHtml({ report, ...opt }), { waitUntil: 'load' })
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
      for (const el of document.querySelectorAll('.cat,.num,.pct,.flag,.cmd,.h,.badge')) {
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
