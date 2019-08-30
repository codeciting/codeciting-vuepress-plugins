'use strict'
const spawn = require('cross-spawn')

let _r

module.exports = function (options = {}, ctx) {
  let { transformer } = options

  return {
    ready () {
      _r = getRecentlyChangedFiles()
      Object.defineProperty(_r, '_lang', {
        writable: true,
        value: null,
        enumerable: false,
        configurable: false
      })
    },
    extendPageData ($page) {
      const $lang = $page._computed.$lang

      transformer = typeof transformer === 'function'
        ? transformer
        : defaultTimeTransformer.bind(undefined, $lang)

      $page.authors = getGitAuthors($page._filePath)
      $page.recentUpdates = getRecentlyChangedLog($page._filePath)
      $page.recentUpdates.forEach(log => log.updateDate = transformer(log.updateDateTimestamp))
      if (!_r) {
        return
      }
      if (_r._lang !== $lang) {
        _r._lang = $lang
        _r.forEach(log => {
          log.updateDate = transformer(log.updateDateTimestamp)
          log.createDate = transformer(log.createDateTimestamp)
        })
      }
      $page.recentPages = _r
    }
  }
}

function defaultTimeTransformer (lang, timestamp) {
  return new Date(timestamp).toLocaleString(lang)
}

function getGitLastUpdatedTimeStamp (filePath) {
  let lastUpdated
  try {
    lastUpdated = parseInt(spawn.sync('git', ['log', '-1', '--format=%ct', filePath]).stdout.toString('utf-8')) * 1000
  } catch (e) { /* do not handle for now */ }
  return lastUpdated
}

function getGitAuthors (filePath) {
  try {
    return spawn.sync('sh', ['-c', `git log --format=%cn ${filePath} | sort | uniq`])
      .stdout
      .toString('utf-8')
      .trim()
      .split(/\s/)
  } catch (e) {
    return '(NaN)'
  }
}

function getRecentlyChangedLog (file, count = 5) {
  function parseResult (raw) {
    const lines = raw.split(/\n/m)
    const records = []
    lines.forEach(line => {
      if (!line.trim()) {
        return
      }
      const [updateDate, author] = line.replace(/^"/, '').replace(/"$/, '').split(';')
      const current = {
        updateDateTimestamp: +updateDate * 1000,
        author
      }
      records.push(current)
    })
    return records
  }

  try {
    return parseResult(
      spawn.sync('git', ['log', '-' + count, '--no-merges', '-w', '--format="%at;%an"', file])
        .stdout
        .toString('utf-8'))
  } catch (e) {
    console.error(e)
    return []
  }
}

function getRecentlyChangedFiles (count = 5) {
  function parseResult (raw) {
    const lines = raw.split(/\n/m)
    const records = []
    let current = null
    lines.forEach(line => {
      if (!line.trim()) {
      } else if (line.startsWith(' ')) {
        if (/^\d+ file changed,/.test(line.trim())) {
          return
        }
        const [path] = line.trim().split(' | ')
        current.path = '/' + path.replace(/(?:README|INDEX)\.md$/gi, '')
      } else {
        if (current) {
          records.push(current)
          current = null
        }
        const [updateDate, createDate, author] = line.replace(/^"/, '').replace(/"$/, '').split(';')
        current = {
          updateDateTimestamp: +updateDate * 1000,
          createDateTimestamp: +createDate * 1000,
          author,
          path: null
        }
      }
    })
    return records
  }

  try {
    return parseResult(
      spawn.sync('git', ['log', '-' + count, '--stat', '--no-merges', '-w', '--format="%at;%ct;%an"', '**/*.md'])
        .stdout
        .toString('utf-8'))
  } catch (e) {
    return []
  }

}
