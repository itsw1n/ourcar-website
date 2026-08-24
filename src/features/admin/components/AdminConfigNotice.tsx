export function AdminConfigNotice() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-6">
      <div
        data-ui="admin-config-notice"
        className="max-w-lg border border-border bg-background p-8"
      >
        <h1 className="text-lg font-bold uppercase tracking-wide text-foreground">
          Admin requires Supabase
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          The admin area needs a configured Supabase project. This app is
          currently running in <strong className="text-foreground">mock</strong>{' '}
          mode (no database), so the admin is disabled.
        </p>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          To enable the full admin locally, start a local Supabase stack and set
          the environment variables in <code>.env.local</code>:
        </p>
        <pre className="mt-3 overflow-x-auto border border-border bg-muted p-3 text-xs text-foreground">
          {`make supabase:start
# then add to .env.local:
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
NEXT_PUBLIC_DATA_SOURCE=supabase`}
        </pre>
        <p className="mt-3 text-sm text-muted-foreground">
          Then run <code className="text-foreground">make dev</code> again.
        </p>
      </div>
    </main>
  )
}
