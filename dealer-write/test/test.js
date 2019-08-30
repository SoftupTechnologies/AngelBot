let assert = require('assert')
const parseInput = require('../parse_changelog')

const fs = require('fs')
const { promisify } = require('util')
const path = require('path')
const readFile = promisify(fs.readFile)
const absolutePathChangelog = path.join(__dirname, './example_chl.md')
const absolutePathCompare = path.join(__dirname, './example_result.json')

describe('Parsing tests', () => {
  it('Changelog parsed correctly', async () => {
    const changeLogContent = await readFile(absolutePathChangelog, 'utf-8')
    const compareToResultContent = await readFile(absolutePathCompare, 'utf-8')

    assert.strictEqual(
      JSON.stringify(parseInput(changeLogContent)),
      compareToResultContent
    )
  })
})
