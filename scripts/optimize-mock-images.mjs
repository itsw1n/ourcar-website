import { promises as fs } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const publicDir = path.resolve(__dirname, '..', 'public')

const TARGETS = ['mock-car-1.png', 'mock-car-2.png', 'mock-car-3.png']
const MAX_WIDTH = 1280
const QUALITY = 82

async function optimize(file) {
  const input = path.join(publicDir, file)
  const buffer = await fs.readFile(input)
  const image = sharp(buffer)
  const meta = await image.metadata()

  if ((meta.width ?? 0) <= MAX_WIDTH && meta.format === 'png') {
    const original = buffer.length
    const optimized = await image.png({ quality: QUALITY }).toBuffer()
    if (optimized.length < original) {
      await fs.writeFile(input, optimized)
      console.log(
        `optimized ${file}: ${(original / 1024).toFixed(0)}KB -> ${(optimized.length / 1024).toFixed(0)}KB`
      )
    } else {
      console.log(`skipped ${file}: already minimal`)
    }
    return
  }

  const resized = await image
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .png({ quality: QUALITY })
    .toBuffer()
  await fs.writeFile(input, resized)
  console.log(
    `resized ${file}: ${(buffer.length / 1024).toFixed(0)}KB -> ${(resized.length / 1024).toFixed(0)}KB`
  )
}

for (const file of TARGETS) {
  try {
    await optimize(file)
  } catch (error) {
    console.error(`failed ${file}:`, error)
    process.exitCode = 1
  }
}
