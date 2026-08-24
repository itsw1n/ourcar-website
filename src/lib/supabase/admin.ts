import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database.types'

// NEVER import this in client components.
// Server only — uses the service role key (bypasses RLS).
export const adminClient = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)
