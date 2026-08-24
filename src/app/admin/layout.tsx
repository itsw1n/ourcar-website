import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { isSupabaseMode } from '@/lib/dataSource'
import { QueryProvider } from '@/components/shared/QueryProvider'
import { AdminShell } from '@/features/admin/components/AdminShell'
import { AdminConfigNotice } from '@/features/admin/components/AdminConfigNotice'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  if (!isSupabaseMode) {
    return <AdminConfigNotice />
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login?redirect=/admin')

  return (
    <QueryProvider>
      <AdminShell>{children}</AdminShell>
    </QueryProvider>
  )
}
