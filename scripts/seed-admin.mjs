#!/usr/bin/env node
// DEV ONLY: provisions a local admin login via the Supabase Auth Admin API.
// Email: admin@local.dev   Password: admin1234
// Idempotent — safe to re-run (make db-reset / make db-seed).
import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !key) {
  console.error(
    'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.'
  )
  process.exit(1)
}

const EMAIL = 'admin@local.dev'
const PASSWORD = 'admin1234'

const supabase = createClient(url, key, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const { data, error } = await supabase.auth.admin.createUser({
  email: EMAIL,
  password: PASSWORD,
  email_confirm: true,
  user_metadata: {},
})

if (error) {
  if (/already registered/i.test(error.message)) {
    console.log('admin user already exists')
  } else {
    console.error('createUser failed:', error.message)
    process.exit(1)
  }
} else {
  console.log('created admin user')
}

console.log(`Local admin provisioned -> ${EMAIL} / ${PASSWORD}`)
console.log(
  'Promoting to role=admin is handled by the Makefile (psql, postgres superuser).'
)
