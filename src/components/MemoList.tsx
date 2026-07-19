import { useState } from 'react';
import type { Memo } from '../types';

interface MemoListProps {
  memos: Memo[];
  onSelectMemo: (memo: Memo) => void;
}

type SortOrder = 'createdAt' | 'title';

export function MemoList({ memos, onSelectMemo }: MemoListProps) {
  const [sortOrder, setSortOrder] = useState<SortOrder>('createdAt');

  const sorted = [...memos].sort((a, b) =>
    sortOrder === 'title' ? a.title.localeCompare(b.title, 'ja') : b.createdAt - a.createdAt
  );

  return (
    <div className="memo-list">
      <div className="sort-toggle">
        <button
          className={sortOrder === 'createdAt' ? 'active' : ''}
          onClick={() => setSortOrder('createdAt')}
        >
          登録順
        </button>
        <button className={sortOrder === 'title' ? 'active' : ''} onClick={() => setSortOrder('title')}>
          タイトル順
        </button>
      </div>
      {sorted.length === 0 ? (
        <p className="empty-state">まだメモがありません。右下の＋から作成してください。</p>
      ) : (
        <ul>
          {sorted.map((memo) => (
            <li key={memo.id} onClick={() => onSelectMemo(memo)}>
              <span className="memo-title">{memo.title}</span>
              {memo.text && <span className="memo-preview">{memo.text.slice(0, 30)}</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}