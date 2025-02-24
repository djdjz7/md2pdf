import MarkdownIt from 'markdown-it'
import { createHighlighter } from 'shiki'
import MathJax3 from 'markdown-it-mathjax3'
import MarkdownItAnchor from 'markdown-it-anchor'

const highlighter = await createHighlighter({
  themes: ['catppuccin-latte'],
  langs: ['python', 'javascript', 'typescript', 'html', 'css', 'json', 'yaml', 'markdown'],
})

const mdit = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: (code, lang) => {
    if (lang === 'mermaid') {
      return `<div class="mermaid">${code}</div>`
    }
    const result = highlighter.codeToHtml(code, {
      theme: 'catppuccin-latte',
      lang,
    })
    return result
  },
})
  .use(MathJax3)
  .use(MarkdownItAnchor)

export default mdit
