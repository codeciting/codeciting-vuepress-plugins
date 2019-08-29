'use strict'

const markdownItPlugin = require('./markdown-it-plugin')

module.exports = function (options, ctx) {
  const cssResolver = options.resolveStyleSheetHref || function resolveKatexStylesheetHref (version) {
    return `https://cdn.bootcss.com/KaTeX/${version}/katex.min.css`
  }

  // Add katex css
  ctx.siteConfig.head = ctx.siteConfig.head || []
  ctx.siteConfig.head.push([
    'link',
    {
      rel: 'stylesheet',
      href: cssResolver(require('katex').version)
    }
  ])

  return {
    name: '@codeciting/math',
    extendMarkdown: md => {
      md.use(markdownItPlugin)
    }
  }
}
