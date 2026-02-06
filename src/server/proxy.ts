const DEEZER_BASE = 'https://api.deezer.com'
const proxyUrl = new URL(process.env.PROXY_URL ?? 'http://localhost:9476')

Bun.serve({
  port: Number(proxyUrl.port),
  async fetch(req) {
    const url = new URL(req.url)
    const deezerPath = url.pathname.replace('/api/deezer', '')
    const targetUrl = `${DEEZER_BASE}${deezerPath}${url.search}`

    console.log(`[proxy] ${url.pathname} → ${targetUrl}`)

    try {
      const response = await fetch(targetUrl)
      const body = await response.text()

      console.log(`[proxy] ${response.status} ${body.slice(0, 200)}`)

      return new Response(body, {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      })
    } catch (err) {
      console.error(`[proxy] FAILED ${url.pathname}:`, (err as Error).message)
      return new Response(JSON.stringify({ error: { message: 'Deezer request failed' } }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      })
    }
  },
})

console.log(`Proxy listening on ${proxyUrl.href}`)
