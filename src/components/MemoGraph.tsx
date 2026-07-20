import { useRef, useState, useEffect } from 'react';
import type { Memo, MemoInput } from '../types';
import { Feather, Weight, Palette, Contrast } from 'lucide-react';

type PendingMemo = Omit<MemoInput, 'weight' | 'colorfulness'>;

interface MemoGraphProps {
  memos: Memo[];
  pendingMemo: PendingMemo | null;
  onConfirmPlacement: (weight: number, colorfulness: number) => void;
  onCancelPlacement: () => void;
  onUpdatePosition: (id: string, weight: number, colorfulness: number) => void;
  onSelectMemo: (memo: Memo) => void;
}

export function MemoGraph({
  memos,
  pendingMemo,
  onConfirmPlacement,
  onCancelPlacement,
  onUpdatePosition,
  onSelectMemo,
}: MemoGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [isDraggingPending, setIsDraggingPending] = useState(false);
  const [pendingPos, setPendingPos] = useState({ weight: 50, colorfulness: 50 });

  // 新しい配置待ちメモが来たら中央からスタート
  useEffect(() => {
    if (pendingMemo) setPendingPos({ weight: 50, colorfulness: 50 });
  }, [pendingMemo]);

  const calcPosition = (clientX: number, clientY: number) => {
    const rect = containerRef.current!.getBoundingClientRect();
    const colorfulness = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
    const weight = Math.min(100, Math.max(0, ((clientY - rect.top) / rect.height) * 100));
    return { weight, colorfulness };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (draggingId) {
      const pos = calcPosition(e.clientX, e.clientY);
      onUpdatePosition(draggingId, pos.weight, pos.colorfulness);
    } else if (isDraggingPending) {
      setPendingPos(calcPosition(e.clientX, e.clientY));
    }
  };

  const stopDragging = () => {
    setDraggingId(null);
    setIsDraggingPending(false);
  };

  return (
    <div className="graph-container">
      <div
        ref={containerRef}
        className="graph-plane"
        onPointerMove={handlePointerMove}
        onPointerUp={stopDragging}
        onPointerLeave={stopDragging}
      >
        <div className="graph-axis-label graph-axis-top"><Feather size={16} /></div>
        <div className="graph-axis-label graph-axis-bottom"><Weight size={16} /></div>
        <div className="graph-axis-label graph-axis-left"><Contrast size={16} /></div>
        <div className="graph-axis-label graph-axis-right"><Palette size={16} /></div>
        
        {memos.map((memo) => (
          <div
            key={memo.id}
            className="graph-dot"
            style={{
              left: `${memo.colorfulness}%`,
              top: `${memo.weight}%`,
              width: `${10 + memo.weight / 8}px`,
              height: `${10 + memo.weight / 8}px`,
              backgroundColor: `hsl(210 ${memo.colorfulness}% 45%)`,
              opacity: 0.55 + memo.weight / 250,
            }}
            onPointerDown={(e) => {
              e.stopPropagation();
              setDraggingId(memo.id);
            }}
            onClick={() => !draggingId && onSelectMemo(memo)}
            title={memo.title}
          />
        ))}

        {pendingMemo && (
          <div
            className="graph-dot graph-dot-pending"
            style={{ left: `${pendingPos.colorfulness}%`, top: `${pendingPos.weight}%` }}
            onPointerDown={(e) => {
              e.stopPropagation();
              setIsDraggingPending(true);
            }}
          />
        )}
      </div>

      {pendingMemo && (
        <div className="graph-confirm-bar">
          <span>ドラッグして位置を決めてください</span>
          <div>
            <button onClick={onCancelPlacement}>キャンセル</button>
            <button
              className="primary"
              onClick={() => onConfirmPlacement(pendingPos.weight, pendingPos.colorfulness)}
            >
              この位置で登録
            </button>
          </div>
        </div>
      )}
    </div>
  );
}