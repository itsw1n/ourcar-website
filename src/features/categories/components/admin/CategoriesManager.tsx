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
  Button as AriaButton,
} from 'react-aria-components'
import { Pencil, Trash2, Plus } from 'lucide-react'
import {
  useCategoriesAdmin,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from '@/features/categories/hooks/useCategories'
import {
  LoadingState,
  ErrorState,
  EmptyState,
} from '@/features/admin/components/States'
import { ConfirmDialog } from '@/features/admin/components/ConfirmDialog'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import type { CategoryAdminView } from '@/features/categories/services/category.service'

export function CategoriesManager() {
  const { data, isLoading, error } = useCategoriesAdmin()
  const createCategory = useCreateCategory()
  const updateCategory = useUpdateCategory()
  const deleteCategory = useDeleteCategory()

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<CategoryAdminView | null>(null)
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [nameError, setNameError] = useState<string | null>(null)

  const [deleting, setDeleting] = useState<CategoryAdminView | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  if (isLoading) return <LoadingState />
  if (error) return <ErrorState error={error.message} />

  function openCreate() {
    setEditing(null)
    setName('')
    setSlug('')
    setNameError(null)
    setFormOpen(true)
  }

  function openEdit(category: CategoryAdminView) {
    setEditing(category)
    setName(category.name)
    setSlug(category.slug)
    setNameError(null)
    setFormOpen(true)
  }

  function save() {
    if (!name.trim()) {
      setNameError('Name is required')
      return
    }
    const payload = { name: name.trim(), slug: slug.trim() || undefined }
    if (editing) {
      updateCategory.mutate(
        { id: editing.id, input: payload },
        { onSuccess: () => setFormOpen(false) }
      )
    } else {
      createCategory.mutate(payload, { onSuccess: () => setFormOpen(false) })
    }
  }

  function confirmDelete() {
    if (!deleting) return
    deleteCategory.mutate(deleting.id, {
      onSuccess: () => {
        setDeleting(null)
        setDeleteError(null)
      },
      onError: (err) => setDeleteError(err.message),
    })
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold uppercase tracking-wide text-foreground">
          Categories
        </h1>
        <Button variant="primary" size="sm" onClick={openCreate}>
          <Plus size={16} aria-hidden="true" />
          Add category
        </Button>
      </div>

      {(data ?? []).length === 0 ? (
        <EmptyState
          title="No categories yet"
          description="Add your first category."
        />
      ) : (
        <div className="overflow-x-auto border border-border">
          <table
            data-ui="categories-table"
            className="w-full min-w-[560px] text-left text-sm"
          >
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-3 font-bold">Name</th>
                <th className="px-4 py-3 font-bold">Slug</th>
                <th className="px-4 py-3 font-bold">Vehicles</th>
                <th className="px-4 py-3 font-bold" />
              </tr>
            </thead>
            <tbody>
              {(data ?? []).map((category) => (
                <tr
                  key={category.id}
                  data-ui="category-row"
                  className="border-b border-border last:border-0"
                >
                  <td className="px-4 py-3 font-bold text-foreground">
                    {category.name}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {category.slug}
                  </td>
                  <td className="px-4 py-3 text-foreground">
                    {category.vehicleCount}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <AriaButton
                        aria-label="Edit category"
                        onPress={() => openEdit(category)}
                        className="inline-flex h-9 w-9 items-center justify-center border border-border text-foreground"
                      >
                        <Pencil size={16} aria-hidden="true" />
                      </AriaButton>
                      <AriaButton
                        aria-label="Delete category"
                        onPress={() => {
                          setDeleteError(null)
                          setDeleting(category)
                        }}
                        className="inline-flex h-9 w-9 items-center justify-center border border-border text-primary"
                      >
                        <Trash2 size={16} aria-hidden="true" />
                      </AriaButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ModalOverlay
        isOpen={formOpen}
        onOpenChange={setFormOpen}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      >
        <Modal
          data-ui="category-form"
          className="w-full max-w-sm border border-border bg-background p-6"
        >
          <Dialog>
            {() => (
              <>
                <Heading className="text-sm font-bold uppercase tracking-wide">
                  {editing ? 'Edit category' : 'Add category'}
                </Heading>
                <div className="mt-4 flex flex-col gap-4">
                  <TextField value={name} onChange={setName}>
                    <Label className="mb-1 block text-xs font-bold uppercase tracking-wider">
                      Name
                    </Label>
                    <Input className={cn(inputClass)} placeholder="Mini Van" />
                  </TextField>
                  {nameError ? (
                    <p className="text-xs font-medium text-primary">
                      {nameError}
                    </p>
                  ) : null}
                  <TextField value={slug} onChange={setSlug}>
                    <Label className="mb-1 block text-xs font-bold uppercase tracking-wider">
                      Slug (optional)
                    </Label>
                    <Input className={cn(inputClass)} placeholder="mini-van" />
                  </TextField>
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
                      createCategory.isPending || updateCategory.isPending
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
          if (!open) {
            setDeleting(null)
            setDeleteError(null)
          }
        }}
        title="Delete category"
        message={`Delete "${deleting?.name}"?${
          (deleting?.vehicleCount ?? 0) > 0
            ? ' It is still used by vehicles, so this will be blocked.'
            : ''
        }`}
        pending={deleteCategory.isPending}
        onConfirm={confirmDelete}
      />
      {deleteError ? (
        <p
          role="alert"
          className="mt-4 border border-primary bg-primary/10 px-3 py-2 text-sm font-medium text-primary"
        >
          {deleteError}
        </p>
      ) : null}
    </div>
  )
}

const inputClass =
  'w-full border border-border bg-background px-4 py-3 text-sm outline-none focus-visible:border-foreground focus-visible:ring-2 focus-visible:ring-primary'
