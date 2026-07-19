import type { Memo } from '../types';

interface MemoDetailModalProps {
  memo: Memo;
  onClose: () => void;
  onDelete: (id: string) => void;
}

export function MemoDetailModal({ memo, onClose, onDelete }: MemoDetailModalProps) {
  const imageUrl = memo.imageBlob ? URL.createObjectURL(memo.imageBlob) : null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{memo.title}</h2>
        {imageUrl && <img src={imageUrl} alt={memo.title} className="detail-image" />}
        {memo.text && <p>{memo.text}</p>}
        {memo.url && (
          <a href={memo.url} target="_blank" rel="noreferrer">
            {memo.url}
          </a>
        )}
        <div className="modal-actions">
          <button onClick={() => onDelete(memo.id)}>削除</button>
          <button className="primary" onClick={onClose}>
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}