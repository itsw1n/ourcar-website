'use client'

import {
  Select,
  Label,
  Button as AriaButton,
  SelectValue,
  Popover,
  ListBox,
  ListBoxItem,
} from 'react-aria-components'
import { ChevronDown } from 'lucide-react'
import { useQueryState, parseAsString } from 'nuqs'
import { cn } from '@/lib/utils'
import type { VehicleCategory } from '@/features/vehicles/mock-data'

export function VehicleCategoryFilter({
  categories,
}: {
  categories: VehicleCategory[]
}) {
  const [category, setCategory] = useQueryState(
    'category',
    parseAsString.withOptions({ clearOnDefault: true })
  )

  return (
    <Select
      data-ui="category-select"
      selectedKey={category ?? 'all'}
      onSelectionChange={(key) => {
        void setCategory(key === 'all' ? null : (key as string))
      }}
      aria-label="Filter by category"
      className="w-full md:w-56"
    >
      <Label className="sr-only">Category</Label>
      <AriaButton className="flex w-full items-center justify-between border border-border bg-background px-4 py-3 text-sm outline-none transition-colors duration-200 focus-visible:border-foreground focus-visible:ring-2 focus-visible:ring-primary">
        <SelectValue />
        <ChevronDown
          size={16}
          aria-hidden="true"
          className="text-muted-foreground"
        />
      </AriaButton>
      <Popover className="w-full md:w-56">
        <ListBox className="border border-border bg-background py-1">
          <ListBoxItem
            id="all"
            className={({ isSelected }) =>
              cn(
                'cursor-pointer px-4 py-2 text-sm outline-none',
                isSelected ? 'text-primary' : 'text-foreground hover:bg-muted'
              )
            }
          >
            All Categories
          </ListBoxItem>
          {categories.map((item) => (
            <ListBoxItem
              key={item.id}
              id={item.slug}
              className={({ isSelected }) =>
                cn(
                  'cursor-pointer px-4 py-2 text-sm outline-none',
                  isSelected ? 'text-primary' : 'text-foreground hover:bg-muted'
                )
              }
            >
              {item.name}
            </ListBoxItem>
          ))}
        </ListBox>
      </Popover>
    </Select>
  )
}
