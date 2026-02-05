import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { resolve } from 'node:path'

const addinUrl = process.env.ADDIN_URL ?? 'https://localhost:3000'
const root = resolve(import.meta.dirname, '..')

const template = readFileSync(resolve(root, 'manifest.xml'), 'utf-8')
const output = template.replaceAll('{{ADDIN_URL}}', addinUrl)

const distDir = resolve(root, 'dist')
mkdirSync(distDir, { recursive: true })
writeFileSync(resolve(distDir, 'manifest.xml'), output)
console.log(`Generated dist/manifest.xml with ADDIN_URL=${addinUrl}`)

const wefDir = resolve(homedir(), 'Library/Containers/com.microsoft.Excel/Data/Documents/wef')
if (existsSync(wefDir)) {
  writeFileSync(resolve(wefDir, 'musicall-manifest.xml'), output)
  console.log('Copied to Excel sideload directory')
}
