'use client'

import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import { useQueryState, parseAsString } from 'nuqs'
import { cn } from '@/lib/utils'

export function VehicleSearch() {
  const [search, setSearch] = useQueryState(
    'search',
    parseAsString.withOptions({ clearOnDefault: true })
  )
  const [value, setValue] = useState(search ?? '')

  useEffect(() => {
    setValue(search ?? '')
  }, [search])

  useEffect(() => {
    if (value === (search ?? '')) return
    const id = setTimeout(() => {
      void setSearch(value || null)
    }, 300)
    return () => clearTimeout(id)
  }, [value, search, setSearch])

  return (
    <div data-ui="vehicle-search" className="relative w-full">
      <Search
        size={18}
        aria-hidden="true"
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
      />
      <label htmlFor="vehicle-search" className="sr-only">
        Search brand or model
      </label>
      <input
        id="vehicle-search"
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Search brand or model..."
        className={cn(
          'w-full border border-border bg-background py-3 pl-11 pr-4 text-sm outline-none transition-colors duration-200',
          'focus-visible:border-foreground'
        )}
      />
    </div>
  )
}
