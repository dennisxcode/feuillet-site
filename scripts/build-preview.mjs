/**
 * Fold the site into one file you can open, mail, or drop anywhere.
 *
 * The site itself is three files on purpose: a stylesheet the browser can
 * cache, a script it can defer, and a page. That is right for a deploy and
 * wrong for a preview, because a preview gets opened from a Downloads folder
 * or handed to a viewer that only takes one document. So this inlines the
 * CSS, the JS and the woff2 (as a data URI, since a relative font URL is the
 * first thing to break once the file has moved) and writes preview.html.
 *
 *   node scripts/build-preview.mjs            → preview.html, a full document
 *   node scripts/build-preview.mjs --fragment → preview-fragment.html, body only
 *
 * The fragment form exists for hosts that supply their own document
 * skeleton and reject a nested <html>.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const read = (p) => readFileSync(join(root, p), 'utf8')

const fragment = process.argv.includes('--fragment')

const css = read('styles.css')
const js = read('site.js')
const font = readFileSync(join(root, 'assets/feuillet-sans.woff2')).toString('base64')

// The one asset that has to travel inside the CSS. Everything else the page
// references (favicon, the social card) is decoration a preview does without.
const inlinedCss = css.replace(
  "url('assets/feuillet-sans.woff2') format('woff2')",
  `url(data:font/woff2;base64,${font}) format('woff2')`
)

let html = read('static.html')
  .replace('<link rel="stylesheet" href="styles.css" />', `<style>\n${inlinedCss}\n</style>`)
  .replace('<script src="site.js"></script>', `<script>\n${js}\n</script>`)

if (fragment) {
  // Keep the pre-paint theme script: without it a viewer that has already
  // chosen light gets a charcoal flash on the way in.
  const boot = html.match(/<script>\s*try \{[\s\S]*?<\/script>/)?.[0] ?? ''
  const style = html.match(/<style>[\s\S]*?<\/style>/)?.[0] ?? ''
  const title = html.match(/<title>[\s\S]*?<\/title>/)?.[0] ?? ''
  const body = html.match(/<body>([\s\S]*)<\/body>/)?.[1] ?? ''
  html = `${title}\n${boot}\n${style}\n${body}`
  writeFileSync(join(root, 'preview-fragment.html'), html)
  console.log(`preview-fragment.html  ${(html.length / 1024).toFixed(0)} KB`)
} else {
  writeFileSync(join(root, 'preview.html'), html)
  console.log(`preview.html  ${(html.length / 1024).toFixed(0)} KB`)
}
