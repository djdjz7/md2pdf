import { spawnSync } from 'child_process'
import mdit from './markdown'
import * as fs from 'fs/promises'
import pc from 'picocolors'

console.log(pc.bold(pc.bgGreen('Simple Markdown Renderer [WKHTMLTOPDF, EXPERIMENTAL]')))
console.log(pc.green('Reading markdown and CSS files...'))
const md = await fs.readFile('./md/src.md', 'utf-8')
const cssFiles = ['./src/assets/base.css', './src/assets/codeblocks.css', './src/assets/main.css']
let css = ''
for (const file of cssFiles) {
  css += await fs.readFile(file, 'utf-8')
}
css = css.replace('InterVariable', `"Inter", -apple-system`).replace('Fira Code VF', 'Fira Code')

console.log(pc.green('Rendering HTML...'))
const html = mdit.render(mdit.render(mdit.render(md)))
const completeHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="../node_modules/mermaid/dist/mermaid.min.js" />
  <script type="module">
    mermaid.initialize({ startOnLoad: true, fontFamily: 'Fira Code', theme: 'default' })
    document.mermaid = mermaid
  </script>
  <style>
    ${css}
  </style>
</head>
<body>
  ${html}
</body>
</html>`
await fs.writeFile('./md/output.html', completeHtml)

console.log(pc.green('Rendering PDF...'))

const spawnResult = spawnSync(
  'wkhtmltopdf',
  [
    '--page-size A3',
    '--enable-local-file-access',
    '--disable-smart-shrinking',
    '--no-stop-slow-scripts',
    './md/output.html',
    'output.pdf',
  ],
  {
    shell: true,
    stdio: 'inherit',
  },
)

if (spawnResult.error) {
  console.error(pc.red('Error rendering PDF with wkhtmltopdf.'))
  console.error(pc.yellow('  -> Is wkhtmltopdf installed and added to PATH?'))
  process.exit(1)
}

console.log(pc.green('PDF saved to ') + pc.underline(pc.cyan('output.pdf')))

console.log(pc.green('Cleaning up...'))
await fs.rm('./md/output.html')

console.log(pc.green('Done!'))
console.log()
console.log(pc.bold(pc.bgYellow('Output PDF may contain following issues:')))
console.log(pc.yellow('Fonts not rendered:'))
console.log(
  '  -> Install "Fira Code" (not "Fira Code VF") and "Inter" (not InterVariable) fonts on your system locally.',
)
console.log('  -> Fira Code:', pc.underline(pc.cyan('https://github.com/tonsky/FiraCode')))
console.log('  ->     Inter:', pc.underline(pc.cyan('https://rsms.me/inter/')))
console.log(pc.yellow('Mermaid codeblocks not rendered:'))
console.log('  -> Mermaid currently not supported by this renderer')
console.log(pc.yellow('Codeblocks creating new pages, resulting in large empty spaces:'))
console.log('  -> Known issue, no fix available yet.')
