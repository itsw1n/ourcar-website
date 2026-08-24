'use client'

import { useRef, useState } from 'react'
import { Plus, X, ArrowUp, ArrowDown, Star } from 'lucide-react'
import {
  useUploadVehicleImage,
  useDeleteVehicleImage,
} from '@/features/vehicles/hooks/useAdminVehicles'
import type { VehicleImageInput } from '@/features/vehicles/types/vehicle'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

export function ImageUploader({
  value,
  onChange,
}: {
  value: VehicleImageInput[]
  onChange: (next: VehicleImageInput[]) => void
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const upload = useUploadVehicleImage()
  const removeImage = useDeleteVehicleImage()
  const [busy, setBusy] = useState(false)

  async function onFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    setBusy(true)
    for (const file of Array.from(files)) {
      try {
        const result = await upload.mutateAsync(file)
        onChange([...value, { url: result.url, path: result.path, alt: '' }])
      } catch {
        // surface nothing here; upload failure is rare for admin flow
      }
    }
    setBusy(false)
    if (fileRef.current) fileRef.current.value = ''
  }

  function remove(index: number) {
    const item = value[index]
    if (item.path) removeImage.mutate(item.path)
    onChange(value.filter((_, i) => i !== index))
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction
    if (target < 0 || target >= value.length) return
    const next = [...value]
    ;[next[index], next[target]] = [next[target], next[index]]
    onChange(next)
  }

  function setCover(index: number) {
    const next = [...value]
    const [item] = next.splice(index, 1)
    next.unshift(item)
    onChange(next)
  }

  return (
    <div data-ui="image-uploader">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {value.map((image, index) => (
          <div
            key={`${image.url}-${index}`}
            data-ui="image-thumb"
            className={cn(
              'relative border border-border',
              index === 0 && 'ring-2 ring-primary'
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image.url}
              alt={image.alt ?? ''}
              className="aspect-[4/3] w-full object-cover"
            />
            <div className="flex items-center justify-between gap-1 border-t border-border p-1">
              <div className="flex gap-0.5">
                <button
                  type="button"
                  aria-label="Move up"
                  disabled={index === 0}
                  onClick={() => move(index, -1)}
                  className="inline-flex h-7 w-7 items-center justify-center border border-border text-foreground disabled:opacity-40"
                >
                  <ArrowUp size={14} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  aria-label="Move down"
                  disabled={index === value.length - 1}
                  onClick={() => move(index, 1)}
                  className="inline-flex h-7 w-7 items-center justify-center border border-border text-foreground disabled:opacity-40"
                >
                  <ArrowDown size={14} aria-hidden="true" />
                </button>
              </div>
              <div className="flex gap-0.5">
                {index !== 0 ? (
                  <button
                    type="button"
                    aria-label="Set as cover"
                    onClick={() => setCover(index)}
                    className="inline-flex h-7 w-7 items-center justify-center border border-border text-primary"
                  >
                    <Star size={14} aria-hidden="true" />
                  </button>
                ) : null}
                <button
                  type="button"
                  aria-label="Remove image"
                  onClick={() => remove(index)}
                  className="inline-flex h-7 w-7 items-center justify-center border border-border text-primary"
                >
                  <X size={14} aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={busy}
          className="flex aspect-[4/3] flex-col items-center justify-center gap-1 border border-dashed border-border text-muted-foreground hover:border-foreground hover:text-foreground"
        >
          <Plus size={20} aria-hidden="true" />
          <span className="text-xs font-bold uppercase">
            {busy ? 'Uploading…' : 'Add'}
          </span>
        </button>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(event) => onFiles(event.target.files)}
      />
      <p className="mt-2 text-xs text-muted-foreground">
        First image is the cover. Reorder with the arrows.
      </p>
    </div>
  )
}
