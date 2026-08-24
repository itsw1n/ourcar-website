import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database.types'
import type { SupabaseClient } from '@supabase/supabase-js'

// Anon (public) client for READS. Deliberately isolated from `server.ts`
// (which imports `next/headers`) so it can be used from modules that end up in
// client bundles without pulling in server-only APIs. Uses the same supabase-js
// client type as `adminClient`, so queries typecheck identically. Public reads
// don't depend on a user session, so no cookie handling is needed; RLS applies
// the anon role. Keep writes/mutations on `adminClient` (service role).
export function readClient(): SupabaseClient<Database> {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
