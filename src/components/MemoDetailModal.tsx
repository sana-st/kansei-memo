import type { Memo } from '../types';

interface MemoDetailModalProps {
  memo: Memo;
  onClose: () => void;
  onDelete: (id: string) => void;
}

export function MemoDetailModal({ memo, onClose, onDelete }: MemoDetailModalProps) {
  const imageUrl = memo.imageBlob ? URL.createObjectURL(memo.imageBlob) : null;

  const MIME_TO_EXT: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/heic': 'heic',
  };

  const handleSaveToPhotos = async () => {
    if (!memo.imageBlob) return;

    const ext = MIME_TO_EXT[memo.imageBlob.type] ?? 'jpg';
    const file = new File([memo.imageBlob], `kansei-memo-${memo.id}.${ext}`, {
      type: memo.imageBlob.type,
    });

    if (!navigator.canShare?.({ files: [file] })) {
      alert('この環境では画像の共有に対応していません');
      return;
    }

    try {
      await navigator.share({ files: [file] });
    } catch (e) {
      // 共有シートを閉じただけの場合はAbortErrorになるので、エラー扱いにしない
      if (e instanceof DOMException && e.name === 'AbortError') return;
      console.error(e);
      alert('共有に失敗しました');
    }
  };

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
          <button onClick={() => {
            if (window.confirm('このメモを削除しますか？')) {
              onDelete(memo.id);
            }
          }}>削除</button>
          {memo.imageBlob && (
            <button onClick={handleSaveToPhotos}>画像を保存</button>
          )}
          <button className="primary" onClick={onClose}>
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}