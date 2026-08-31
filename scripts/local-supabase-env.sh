#!/usr/bin/env bash

_local_supabase_env="$(
  npx supabase status --output env \
    --override-name api.url=NEXT_PUBLIC_SUPABASE_URL 2>&1
)" || {
  printf 'Unable to read the local Supabase environment. Is Supabase running?\n' >&2
  return 1
}

NEXT_PUBLIC_SUPABASE_URL=
ANON_KEY=
SERVICE_ROLE_KEY=

_unquote_local_supabase_value() {
  local raw_value="$1"
  local destination="$2"
  local first_character="${raw_value:0:1}"
  local last_character="${raw_value: -1}"

  if [[ ${#raw_value} -ge 2 && "$first_character" == '"' && "$last_character" == '"' ]]; then
    raw_value="${raw_value:1:${#raw_value}-2}"
  elif [[ ${#raw_value} -ge 2 && "$first_character" == "'" && "$last_character" == "'" ]]; then
    raw_value="${raw_value:1:${#raw_value}-2}"
  elif [[ "$first_character" == '"' || "$first_character" == "'" || "$last_character" == '"' || "$last_character" == "'" ]]; then
    return 1
  fi

  printf -v "$destination" '%s' "$raw_value"
}

while IFS= read -r _local_supabase_line || [[ -n "$_local_supabase_line" ]]; do
  case "$_local_supabase_line" in
    NEXT_PUBLIC_SUPABASE_URL=*)
      _unquote_local_supabase_value "${_local_supabase_line#*=}" NEXT_PUBLIC_SUPABASE_URL || NEXT_PUBLIC_SUPABASE_URL=
      ;;
    ANON_KEY=*)
      _unquote_local_supabase_value "${_local_supabase_line#*=}" ANON_KEY || ANON_KEY=
      ;;
    SERVICE_ROLE_KEY=*)
      _unquote_local_supabase_value "${_local_supabase_line#*=}" SERVICE_ROLE_KEY || SERVICE_ROLE_KEY=
      ;;
  esac
done <<< "$_local_supabase_env"

if [[ -z "$NEXT_PUBLIC_SUPABASE_URL" || -z "$ANON_KEY" || -z "$SERVICE_ROLE_KEY" ]]; then
  printf 'Local Supabase status is missing required environment values.\n' >&2
  unset -f _unquote_local_supabase_value
  unset _local_supabase_env _local_supabase_line ANON_KEY SERVICE_ROLE_KEY
  return 1
fi

export NEXT_PUBLIC_SUPABASE_URL
export NEXT_PUBLIC_SUPABASE_ANON_KEY="$ANON_KEY"
export SUPABASE_SERVICE_ROLE_KEY="$SERVICE_ROLE_KEY"
export NEXT_PUBLIC_DATA_SOURCE=supabase

unset -f _unquote_local_supabase_value
unset _local_supabase_env _local_supabase_line ANON_KEY SERVICE_ROLE_KEY
