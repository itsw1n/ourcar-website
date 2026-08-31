import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function requireUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

// Gate for Server Components / layouts. Redirects unauthenticated or
// non-admin users to the login page. Never uses the service_role client.
export async function requireAdmin(redirectTo = '/admin') {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect(`/login?redirect=${encodeURIComponent(redirectTo)}`)

  const { data, error } = await supabase.rpc('is_admin')
  if (error || !data)
    redirect(`/login?redirect=${encodeURIComponent(redirectTo)}`)

  return user
}

// Returns the authenticated admin's session client so that RLS policies
// (is_admin) are enforced on every query. Throws if the caller is not an
// authenticated admin. Use this for all admin reads/writes.
export async function getAdminClient() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('UNAUTHORIZED')

  const { data, error } = await supabase.rpc('is_admin')
  if (error || !data) throw new Error('FORBIDDEN')

  return supabase
}
