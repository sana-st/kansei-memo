import { useState } from 'react';
import type { MemoInput } from '../types';
import { getHuePreviewColor } from '../colorUtils';

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
  const [hue, setHue] = useState(() => Math.floor(Math.random() * 360)); // 初期値はランダム

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
      hue,
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

        <div className="hue-picker">
          <div className="hue-picker-header">
            <span>色相</span>
            <div className="hue-swatch" style={{ backgroundColor: getHuePreviewColor(hue) }} />
          </div>
          <input
            type="range"
            min={0}
            max={359}
            value={hue}
            onChange={(e) => setHue(Number(e.target.value))}
            className="hue-slider"
          />
        </div>

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