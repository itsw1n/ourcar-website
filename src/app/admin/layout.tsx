import { isSupabaseMode } from '@/lib/dataSource'
import { requireAdmin } from '@/lib/supabase/requireUser'
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

  await requireAdmin('/admin')

  return (
    <QueryProvider>
      <AdminShell>{children}</AdminShell>
    </QueryProvider>
  )
}
