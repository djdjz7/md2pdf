import puppeteer from 'puppeteer'
import { createServer } from 'vite'
import viteConfig from './vite.config'
import pc from 'picocolors'

console.log(pc.bold(pc.bgGreen('Simple Markdown Renderer')))
console.log(pc.green('Starting Vite server...'))
const viteServer = await (
  await createServer({
    ...viteConfig,
    configFile: false,
  })
).listen()

if (!viteServer.httpServer) {
  throw new Error('No vite http server found')
}

const address = viteServer.httpServer.address()
if (!address || typeof address === 'string') {
  throw new Error('Invalid vite http server address')
}

const host = `http://${address.family === 'IPv6' ? `[${address.address}]` : address.address}:${address.port}`

console.log(pc.green('Vite server started at ') + pc.underline(pc.cyan(host)))
console.log(pc.green('Starting Puppeteer...'))
const browser = await puppeteer.launch()
const page = await browser.newPage()
console.log(pc.green('Rendering PDF...'))
await page.goto(host, {
  waitUntil: 'load',
})
await page.evaluate('document.mermaid.run()')
await page.pdf({
  printBackground: true,
  format: 'A4',
  margin: { top: '10mm', right: '10mm', bottom: '10mm', left: '10mm' },
  path: 'output.pdf',
})

console.log(pc.green('PDF saved to ') + pc.underline(pc.cyan('output.pdf')))

console.log(pc.green('Cleaning up...'))
Promise.all([browser.close(), viteServer.close()])
