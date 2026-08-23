export type DataSource = 'mock' | 'supabase'

export function resolveDataSource(): DataSource {
  const explicit = process.env.NEXT_PUBLIC_DATA_SOURCE
  if (explicit === 'mock' || explicit === 'supabase') return explicit

  if (process.env.NODE_ENV !== 'production') return 'mock'

  return process.env.NEXT_PUBLIC_SUPABASE_URL ? 'supabase' : 'mock'
}

export const DATA_SOURCE = resolveDataSource()

export const isMockMode = DATA_SOURCE === 'mock'
export const isSupabaseMode = DATA_SOURCE === 'supabase'
