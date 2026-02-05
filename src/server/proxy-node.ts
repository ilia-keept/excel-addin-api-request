import { spawn } from 'node:child_process'
import { createServer } from 'node:http'

const vite = spawn('npx', ['vite', '--port', '3000'], {
  stdio: 'inherit',
})
vite.on('error', (err) => console.error('Vite failed:', err))

process.on('exit', () => vite.kill())
process.on('SIGINT', () => process.exit())
process.on('SIGTERM', () => process.exit())

const DEEZER_BASE = 'https://api.deezer.com'

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', 'http://localhost:9476')
  const deezerPath = url.pathname.replace('/api/deezer', '')
  const targetUrl = `${DEEZER_BASE}${deezerPath}${url.search}`

  console.log(`[proxy] ${url.pathname} → ${targetUrl}`)

  try {
    const response = await fetch(targetUrl)
    const body = await response.text()

    console.log(`[proxy] ${response.status} ${body.slice(0, 200)}`)

    res.writeHead(response.status, { 'Content-Type': 'application/json' })
    res.end(body)
  } catch (err) {
    console.error(`[proxy] FAILED ${url.pathname}:`, (err as Error).message)
    res.writeHead(502, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: { message: 'Deezer request failed' } }))
  }
})

server.listen(9476, () => {
  console.log('Proxy listening on http://localhost:9476')
})
