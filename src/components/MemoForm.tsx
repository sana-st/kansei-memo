import { useState } from 'react';
import type { MemoInput } from '../types';

type FormOutput = Omit<MemoInput, 'weight' | 'colorfulness'>;

interface MemoFormProps {
  onSubmit: (input: FormOutput) => void;
  onCancel: () => void;
}

export function MemoForm({ onSubmit, onCancel }: MemoFormProps) {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [url, setUrl] = useState('');
  const [imageBlob, setImageBlob] = useState<Blob | undefined>(undefined);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageBlob(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = () => {
    if (!title.trim()) return;
    onSubmit({
      title: title.trim(),
      text: text.trim() || undefined,
      url: url.trim() || undefined,
      imageBlob,
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>新規メモ</h2>
        <input
          type="text"
          placeholder="タイトル（必須）"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="本文"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <input
          type="url"
          placeholder="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {imagePreview && <img src={imagePreview} alt="preview" className="form-image-preview" />}

        <div className="modal-actions">
          <button onClick={onCancel}>キャンセル</button>
          <button onClick={handleSubmit} disabled={!title.trim()}>
            次へ（位置を決める）
          </button>
        </div>
      </div>
    </div>
  );
}