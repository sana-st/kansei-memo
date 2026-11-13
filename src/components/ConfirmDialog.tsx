interface ConfirmDialogProps {
  title: string;
  message?: string;
  confirmLabel: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  title,
  message,
  confirmLabel,
  cancelLabel = 'キャンセル',
  destructive = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <div className="alert-overlay" onClick={onCancel}>
      <div className="alert-box" onClick={(e) => e.stopPropagation()}>
        <div className="alert-content">
          <h3>{title}</h3>
          {message && <p>{message}</p>}
        </div>
        <div className="alert-actions">
          <button onClick={onCancel}>{cancelLabel}</button>
          <button className={destructive ? 'danger' : ''} onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}