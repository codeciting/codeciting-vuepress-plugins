'use strict'
const path = require('path')
module.exports = function (options, ctx) {

  const echartsLibResolver = options.resolveScriptSrc || function resolveEChartsLibSrc (version) {
    return 'https://cdn.bootcss.com/echarts/' + version + '/echarts.min.js'
  }

  ctx.siteConfig.head = ctx.siteConfig.head || []
  ctx.siteConfig.head.push([
    'link',
    {
      id: 'echarts-lib',
      rel: 'prefetch',
      href: echartsLibResolver(options.version || '4.2.1')
    }
  ])

  return {
    name: '@codeciting/echarts',
    clientRootMixin: path.resolve(__dirname, 'mixin.js'),
    extendMarkdown: md => {
      function parseParams (params) {
        const m = params.trim().match(/^\s*echarts\s*(.*)$/)
        if (!m) {
          return null
        }
        const [, argsStr] = m
        return (argsStr || '').trim().split(/\s+/)
      }

      md.use(require('markdown-it-container'), 'echarts', {
        validate (params) {
          params = parseParams(params)
          return params !== null && params.length <= 2
        },
        render (tokens, idx) {
          if (tokens[idx].nesting === 1) {
            const params = parseParams(tokens[idx].info)

            let width, height

            if (params.length === 0) {
            } else if (params.length === 1) {
              width = '600px'
              height = '400px'
            } else if (params.length === 2) {
              width = params[0]
              height = params[1]
            }
            return `<div style="opacity: 0; width=${width}; height=${height}" data-echarts data-echarts-width="${width}" data-echarts-height="${height}">`
          } else {
            return '</div>'
          }
        }
      })

    }
  }
}
