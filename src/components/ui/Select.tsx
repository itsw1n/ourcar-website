'use client'

import {
  Select as AriaSelect,
  Label,
  Button as AriaButton,
  SelectValue,
  Popover,
  ListBox,
  ListBoxItem,
} from 'react-aria-components'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SelectOption {
  value: string
  label: string
}

interface SelectProps {
  label?: string
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  ariaLabel?: string
  hideLabel?: boolean
  placeholder?: string
  className?: string
  buttonClassName?: string
  [key: `data-${string}`]: unknown
}

export function Select({
  label,
  value,
  onChange,
  options,
  ariaLabel,
  hideLabel,
  placeholder = 'Select…',
  className,
  buttonClassName,
  ...rest
}: SelectProps) {
  return (
    <AriaSelect
      data-ui="select"
      selectedKey={value}
      onSelectionChange={(key) => onChange(key == null ? '' : String(key))}
      aria-label={ariaLabel ?? (typeof label === 'string' ? label : undefined)}
      className={cn('w-full', className)}
      {...rest}
    >
      {label ? (
        <Label
          className={cn(
            'mb-1 block text-xs font-bold uppercase tracking-wider text-foreground',
            hideLabel && 'sr-only'
          )}
        >
          {label}
        </Label>
      ) : null}
      <AriaButton
        data-ui="select-trigger"
        className={cn(
          'flex w-full items-center justify-between border border-border bg-background px-4 py-3 text-sm outline-none transition-colors duration-200 focus-visible:border-foreground focus-visible:ring-2 focus-visible:ring-primary',
          buttonClassName
        )}
      >
        <SelectValue className="data-[placeholder]:text-muted-foreground">
          {({ isPlaceholder, selectedText }) =>
            isPlaceholder ? placeholder : selectedText
          }
        </SelectValue>
        <ChevronDown
          size={16}
          aria-hidden="true"
          className="text-muted-foreground"
        />
      </AriaButton>
      <Popover
        data-ui="select-popover"
        className="w-[var(--trigger-width)] min-w-[var(--trigger-width)]"
      >
        <ListBox
          data-ui="select-listbox"
          className="border border-border bg-background py-1"
        >
          {options.map((option) => (
            <ListBoxItem
              key={option.value}
              id={option.value}
              className={({ isSelected }) =>
                cn(
                  'cursor-pointer px-4 py-2 text-sm outline-none',
                  isSelected ? 'text-primary' : 'text-foreground hover:bg-muted'
                )
              }
            >
              {option.label}
            </ListBoxItem>
          ))}
        </ListBox>
      </Popover>
    </AriaSelect>
  )
}
