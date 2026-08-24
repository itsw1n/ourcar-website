import { LoginForm } from '@/features/auth/components/LoginForm'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>
}) {
  const { redirect } = await searchParams
  return <LoginForm redirect={redirect ?? '/admin'} />
}
