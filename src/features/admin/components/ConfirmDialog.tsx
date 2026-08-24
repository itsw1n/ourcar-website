'use client'

import { ModalOverlay, Modal, Dialog, Heading } from 'react-aria-components'
import { Button } from '@/components/ui/Button'

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  message,
  confirmLabel = 'Delete',
  pending = false,
  onConfirm,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  message: string
  confirmLabel?: string
  pending?: boolean
  onConfirm: () => void
}) {
  return (
    <ModalOverlay
      isOpen={open}
      onOpenChange={onOpenChange}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 motion-reduce:transition-none"
    >
      <Modal
        data-ui="confirm-dialog"
        className="w-full max-w-sm border border-border bg-background p-6"
      >
        <Dialog>
          {() => (
            <>
              <Heading className="text-sm font-bold uppercase tracking-wide text-foreground">
                {title}
              </Heading>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {message}
              </p>
              <div className="mt-6 flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  disabled={pending}
                  onClick={onConfirm}
                >
                  {pending ? 'Working…' : confirmLabel}
                </Button>
              </div>
            </>
          )}
        </Dialog>
      </Modal>
    </ModalOverlay>
  )
}
