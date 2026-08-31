'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/client'

export function LoginForm({ redirect }: { redirect: string }) {
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function signInWithGoogle() {
    setPending(true)
    setError(null)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?redirect=${redirect}`,
      },
    })
    if (error) {
      setError(error.message)
      setPending(false)
    }
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

        {error ? (
          <p
            data-ui="login-error"
            role="alert"
            className="mt-4 border border-primary bg-primary/10 px-3 py-2 text-xs font-medium text-primary"
          >
            {error}
          </p>
        ) : null}

        <Button
          type="button"
          onClick={signInWithGoogle}
          disabled={pending}
          className="mt-6 w-full"
        >
          {pending ? 'Redirecting…' : 'Continue with Google'}
        </Button>
      </div>
    </main>
  )
}
