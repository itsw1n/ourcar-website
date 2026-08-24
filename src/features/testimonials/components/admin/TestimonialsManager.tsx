'use client'

import { useState } from 'react'
import {
  ModalOverlay,
  Modal,
  Dialog,
  Heading,
  TextField,
  Label,
  Input,
  TextArea,
  Button as AriaButton,
} from 'react-aria-components'
import { Pencil, Trash2, Plus, Eye, EyeOff } from 'lucide-react'
import {
  useTestimonialsAdmin,
  useCreateTestimonial,
  useUpdateTestimonial,
  useDeleteTestimonial,
  useSetTestimonialVisible,
} from '@/features/testimonials/hooks/useTestimonials'
import {
  LoadingState,
  ErrorState,
  EmptyState,
} from '@/features/admin/components/States'
import { ConfirmDialog } from '@/features/admin/components/ConfirmDialog'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { Star } from 'lucide-react'
import type { Testimonial } from '@/features/testimonials/mockData'

export function TestimonialsManager() {
  const { data, isLoading, error } = useTestimonialsAdmin()
  const createTestimonial = useCreateTestimonial()
  const updateTestimonial = useUpdateTestimonial()
  const deleteTestimonial = useDeleteTestimonial()
  const setVisible = useSetTestimonialVisible()

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Testimonial | null>(null)
  const [displayName, setDisplayName] = useState('')
  const [quote, setQuote] = useState('')
  const [rating, setRating] = useState(5)
  const [isVisible, setIsVisible] = useState(true)

  const [deleting, setDeleting] = useState<Testimonial | null>(null)

  if (isLoading) return <LoadingState />
  if (error) return <ErrorState error={error.message} />

  function openCreate() {
    setEditing(null)
    setDisplayName('')
    setQuote('')
    setRating(5)
    setIsVisible(true)
    setFormOpen(true)
  }

  function openEdit(testimonial: Testimonial) {
    setEditing(testimonial)
    setDisplayName(testimonial.displayName)
    setQuote(testimonial.quote)
    setRating(testimonial.rating)
    setIsVisible(testimonial.isVisible)
    setFormOpen(true)
  }

  function save() {
    const payload = {
      displayName: displayName.trim(),
      quote: quote.trim(),
      rating,
      isVisible,
    }
    if (editing) {
      updateTestimonial.mutate(
        { id: editing.id, input: payload },
        { onSuccess: () => setFormOpen(false) }
      )
    } else {
      createTestimonial.mutate(payload, { onSuccess: () => setFormOpen(false) })
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold uppercase tracking-wide text-foreground">
          Testimonials
        </h1>
        <Button variant="primary" size="sm" onClick={openCreate}>
          <Plus size={16} aria-hidden="true" />
          Add testimonial
        </Button>
      </div>

      {(data ?? []).length === 0 ? (
        <EmptyState
          title="No testimonials yet"
          description="Add a customer testimonial."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {(data ?? []).map((testimonial) => (
            <article
              key={testimonial.id}
              data-ui="testimonial-card"
              className={cn(
                'border border-border p-5',
                !testimonial.isVisible && 'opacity-60'
              )}
            >
              <div className="mb-3 flex gap-1 text-primary">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    fill="currentColor"
                    aria-hidden="true"
                  />
                ))}
              </div>
              <p className="text-sm leading-6 text-muted-foreground">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm font-bold text-foreground">
                  {testimonial.displayName}
                </p>
                <div className="flex gap-2">
                  <AriaButton
                    aria-label={testimonial.isVisible ? 'Hide' : 'Show'}
                    onPress={() =>
                      setVisible.mutate({
                        id: testimonial.id,
                        isVisible: !testimonial.isVisible,
                      })
                    }
                    className="inline-flex h-9 w-9 items-center justify-center border border-border text-foreground"
                  >
                    {testimonial.isVisible ? (
                      <EyeOff size={16} aria-hidden="true" />
                    ) : (
                      <Eye size={16} aria-hidden="true" />
                    )}
                  </AriaButton>
                  <AriaButton
                    aria-label="Edit testimonial"
                    onPress={() => openEdit(testimonial)}
                    className="inline-flex h-9 w-9 items-center justify-center border border-border text-foreground"
                  >
                    <Pencil size={16} aria-hidden="true" />
                  </AriaButton>
                  <AriaButton
                    aria-label="Delete testimonial"
                    onPress={() => setDeleting(testimonial)}
                    className="inline-flex h-9 w-9 items-center justify-center border border-border text-primary"
                  >
                    <Trash2 size={16} aria-hidden="true" />
                  </AriaButton>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <ModalOverlay
        isOpen={formOpen}
        onOpenChange={setFormOpen}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      >
        <Modal
          data-ui="testimonial-form"
          className="w-full max-w-md border border-border bg-background p-6"
        >
          <Dialog>
            {() => (
              <>
                <Heading className="text-sm font-bold uppercase tracking-wide">
                  {editing ? 'Edit testimonial' : 'Add testimonial'}
                </Heading>
                <div className="mt-4 flex flex-col gap-4">
                  <TextField value={displayName} onChange={setDisplayName}>
                    <Label className="mb-1 block text-xs font-bold uppercase tracking-wider">
                      Name
                    </Label>
                    <Input className={cn(inputClass)} />
                  </TextField>
                  <TextField value={quote} onChange={setQuote}>
                    <Label className="mb-1 block text-xs font-bold uppercase tracking-wider">
                      Quote
                    </Label>
                    <TextArea className={cn(inputClass, 'resize-y')} rows={3} />
                  </TextField>
                  <TextField
                    value={String(rating)}
                    onChange={(value) => setRating(Number(value) || 1)}
                  >
                    <Label className="mb-1 block text-xs font-bold uppercase tracking-wider">
                      Rating (1–5)
                    </Label>
                    <Input
                      type="number"
                      min={1}
                      max={5}
                      className={cn(inputClass)}
                    />
                  </TextField>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={isVisible}
                      onChange={(event) => setIsVisible(event.target.checked)}
                      className="h-4 w-4"
                    />
                    Visible on site
                  </label>
                </div>
                <div className="mt-6 flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFormOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    disabled={
                      createTestimonial.isPending || updateTestimonial.isPending
                    }
                    onClick={save}
                  >
                    {editing ? 'Save' : 'Create'}
                  </Button>
                </div>
              </>
            )}
          </Dialog>
        </Modal>
      </ModalOverlay>

      <ConfirmDialog
        open={deleting !== null}
        onOpenChange={(open) => {
          if (!open) setDeleting(null)
        }}
        title="Delete testimonial"
        message={`Delete the testimonial from "${deleting?.displayName}"?`}
        pending={deleteTestimonial.isPending}
        onConfirm={() => {
          if (deleting) {
            deleteTestimonial.mutate(deleting.id, {
              onSuccess: () => setDeleting(null),
            })
          }
        }}
      />
    </div>
  )
}

const inputClass =
  'w-full border border-border bg-background px-4 py-3 text-sm outline-none focus-visible:border-foreground focus-visible:ring-2 focus-visible:ring-primary'
