'use strict'

const markdownItPlugin = require('markdown-it-plantuml')

module.exports = function (options, ctx) {

  function generateSource (umlCode, pluginOptions) {
    return `https://api.codeciting.com/plantuml/?source=${encodeURIComponent(new Buffer(`
@start${pluginOptions.diagramName || 'uml'}
' auto injected theme
!include https://api.codeciting.com/plantuml/theme.puml

${umlCode}
@end`).toString('base64'))}`
  }

  return {
    name: '@codeciting/plantuml',
    extendMarkdown: md => {
      md.use(markdownItPlugin, {
        generateSource: generateSource,
        render (tokens, idx, options, env, slf) {
          const token = tokens[idx]

          // "alt" attr MUST be set, even if empty. Because it's mandatory and
          // should be placed on proper position for tests.
          //
          // Replace content with actual value

          token.attrs[token.attrIndex('alt')][1] =
            slf.renderInlineAsText(token.children, options, env)

          token.attrs.push(['style', 'display: block; margin: 12px auto;'])
          return slf.renderToken(tokens, idx, options)
        }
      })
    }
  }
}
