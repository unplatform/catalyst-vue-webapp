const { redisGetJson } = require('./utils')
const fs = require('fs-extra')
const { join } = require('path')

async function readConfig(filename, fallback = undefined) {
  try {
    const data = await fs.readFile(
      join(__dirname, '../public/config', filename)
    )
    return JSON.parse(data)
  } catch (error) {
    return fallback
  }
}

async function makeVueState(db, apiUrl, appName = 'Catalyst') {
  const [projects, labels, content] = await Promise.all([
    redisGetJson(db, 'cards'),
    redisGetJson(db, 'labels'),
    redisGetJson(db, 'content')
  ])

  const api = {
    projects,
    labels,
    content,
    url: apiUrl
  }

  const filters = await readConfig('filters.json')
  const categories = await readConfig('categories.json')

  const config = { publicPath: 'public/', title: appName }
  if (filters) config.filters = filters
  if (categories) config.categories = categories

  return { api, config }
}

async function renderVueApp(res, renderer, url, context) {
  res.setHeader('Content-Type', 'text/html')

  context.url = url
  context.meta = context.meta || ''

  if (process.env.CUSTOM_STYLES) {
    context.meta += `<link rel="stylesheet" href="${process.env.CUSTOM_STYLES}">`
  }

  try {
    res.end(await renderer.renderToString(context))
  } catch (error) {
    if (error.code !== 404 || error.message.match(/^not found$/i)) {
      console.log(error)
    }

    if (error.url) {
      res.redirect(error.url)
    } else {
      // Render Error Page or Redirect
      res.status(error.code || 500).end(error.message)
      console.error(`error during render : ${url}`)
      console.error(error)
    }
  }
}

module.exports = { renderVueApp, makeVueState }
