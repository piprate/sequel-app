#!/usr/bin/env node

const path = require('path')
const express = require('express')
const compression = require('compression')
const { routes: rawRoutes } = require('./vercel.json')

const { PORT = 3005 } = process.env
const app = express()
const exportDir = path.resolve(__dirname, '__sapper__/export')

const routes = rawRoutes.map(({ src, headers, dest }) => ({
  regex: new RegExp(src),
  headers,
  dest
}))

app.use(compression({ threshold: 0 }))

app.use(express.static(exportDir, {
  setHeaders (res, thisPath) {
    const localPath = '/' + path.relative(exportDir, thisPath)
    for (const { regex, headers } of routes) {
      if (regex.test(localPath)) {
        res.set(headers)
        return
      }
    }
  }
}))

routes.forEach(({ regex, headers, dest }) => {
  app.get(regex, (req, res) => {
    res.set(headers)
    res.sendFile(path.resolve(exportDir, dest ? req.path.replace(regex, dest) : req.path))
  })
})

app.listen(PORT, () => console.log(`listening on port ${PORT}`))

// Handle SIGINT (source: https://github.com/pouchdb/pouchdb-server/blob/fdc6ba7/packages/node_modules/pouchdb-server/lib/index.js#L304-L306)
process.on('SIGINT', () => process.exit(0))
