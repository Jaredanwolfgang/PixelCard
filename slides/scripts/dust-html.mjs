import { cp, readFile } from 'node:fs/promises'
import { createServer } from 'node:http'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const source = path.join(root, 'dust-lora-html')
const destination = path.resolve(root, '../public/slides/dust-lora')
const types = { '.html': 'text/html; charset=utf-8', '.gif': 'image/gif', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml' }
if (process.argv[2] === 'build') {
  await cp(source, destination, { recursive: true })
  console.log(`DUST HTML copied to ${destination}`)
} else if (process.argv[2] === 'serve') {
  const port = Number(process.env.PORT || 3033)
  createServer(async (req, res) => {
    try {
      const url = new URL(req.url || '/', 'http://localhost')
      let relative = decodeURIComponent(url.pathname)
      if (relative === '/' || /^\/slide\/dust-lora\/?(?:\d+)?\/?$/.test(relative)) relative = 'index.html'
      else if (relative.startsWith('/slide/dust-lora/')) relative = relative.slice('/slide/dust-lora/'.length)
      else { res.writeHead(404).end(); return }
      const file = path.resolve(source, relative)
      if (!file.startsWith(source + path.sep) || !types[path.extname(file)]) { res.writeHead(404).end(); return }
      const data = await readFile(file)
      res.writeHead(200, { 'Content-Type': types[path.extname(file)], 'X-Content-Type-Options': 'nosniff', 'Cache-Control': 'no-cache' }).end(data)
    } catch { res.writeHead(404).end() }
  }).listen(port, '127.0.0.1', () => console.log(`DUST preview: http://127.0.0.1:${port}/slide/dust-lora/`))
} else {
  throw new Error('Use build or serve')
}
