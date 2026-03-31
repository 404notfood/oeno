"use client";

import Modal, { ModalButton } from "./Modal";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
  loading?: boolean;
}

const iconPaths = {
  danger:
    "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
  warning:
    "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
  info: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
};

const iconColors = {
  danger: "text-danger bg-danger/10",
  warning: "text-warning bg-warning/10",
  info: "text-info bg-info/10",
};

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirmer",
  cancelText = "Annuler",
  variant = "danger",
  loading = false,
}: ConfirmDialogProps) {
  const handleConfirm = async () => {
    await onConfirm();
    if (!loading) {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      closeOnOverlayClick={!loading}
      footer={
        <>
          <ModalButton onClick={onClose} disabled={loading}>
            {cancelText}
          </ModalButton>
          <ModalButton
            onClick={handleConfirm}
            variant={variant === "info" ? "primary" : "danger"}
            loading={loading}
          >
            {confirmText}
          </ModalButton>
        </>
      }
    >
      <div className="flex gap-4">
        <div
          className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full ${iconColors[variant]}`}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={iconPaths[variant]}
            />
          </svg>
        </div>
        <div>
          <p className="text-sm text-gris-dark">{message}</p>
        </div>
      </div>
    </Modal>
  );
}
