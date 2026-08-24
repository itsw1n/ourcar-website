import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !key) {
  console.error(
    'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY (load .env.local).'
  )
  process.exit(1)
}

const supabase = createClient(url, key, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'public')
const assets = [
  'mock-car-1.png',
  'mock-car-2.png',
  'mock-car-3.png',
  'mock-car-4.png',
]

for (const name of assets) {
  const buffer = readFileSync(join(root, name))
  const { error } = await supabase.storage
    .from('vehicle-images')
    .upload(`seed/${name}`, buffer, {
      upsert: true,
      contentType: 'image/png',
      cacheControl: '3600',
    })

  if (error) {
    console.error(`Failed to upload ${name}:`, error.message)
    process.exit(1)
  }
  console.log(`uploaded seed/${name}`)
}

console.log('Seed storage complete.')
