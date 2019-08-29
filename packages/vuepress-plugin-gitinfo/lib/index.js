'use strict'
const spawn = require('cross-spawn')

module.exports = function (options, ctx) {
  return {
    extendPageData ($page) {
      $page.authors = getGitAuthors($page._filePath)
      console.log($page.path, $page.authors)
    }
  }
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
