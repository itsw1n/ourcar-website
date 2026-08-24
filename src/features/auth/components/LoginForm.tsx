'use client'

import { useState, useTransition, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { TextField, Label, Input } from 'react-aria-components'
import { Button } from '@/components/ui/Button'
import { signInAction } from '@/features/auth/actions/auth.actions'
import { cn } from '@/lib/utils'

export function LoginForm({ redirect }: { redirect: string }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    const formData = new FormData(event.currentTarget)
    startTransition(async () => {
      const result = await signInAction(formData)
      if (result.ok) {
        router.push(redirect)
        router.refresh()
      } else {
        setError(result.error)
      }
    })
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div
        data-ui="login-card"
        className="w-full max-w-sm border border-border bg-background p-8"
      >
        <h1 className="text-xl font-bold uppercase tracking-wide text-foreground">
          Admin Sign In
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Wing&apos;s Buy n Sell
        </p>

        <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4">
          <TextField name="email" type="email" isRequired data-ui="login-email">
            <Label className="mb-1 block text-xs font-bold uppercase tracking-wider text-foreground">
              Email
            </Label>
            <Input
              className={cn(
                'w-full border border-border bg-background px-4 py-3 text-sm outline-none',
                'focus-visible:border-foreground focus-visible:ring-2 focus-visible:ring-primary'
              )}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </TextField>

          <TextField
            name="password"
            type="password"
            isRequired
            data-ui="login-password"
          >
            <Label className="mb-1 block text-xs font-bold uppercase tracking-wider text-foreground">
              Password
            </Label>
            <Input
              className={cn(
                'w-full border border-border bg-background px-4 py-3 text-sm outline-none',
                'focus-visible:border-foreground focus-visible:ring-2 focus-visible:ring-primary'
              )}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </TextField>

          {error ? (
            <p
              data-ui="login-error"
              role="alert"
              className="border border-primary bg-primary/10 px-3 py-2 text-xs font-medium text-primary"
            >
              {error}
            </p>
          ) : null}

          <Button type="submit" disabled={pending} className="mt-2 w-full">
            {pending ? 'Signing in…' : 'Sign In'}
          </Button>
        </form>
      </div>
    </main>
  )
}
