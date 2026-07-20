import { useState } from 'react';
import { useMemos } from './hooks/useMemos';
import { MemoList } from './components/MemoList';
import { MemoGraph } from './components/MemoGraph';
import { MemoForm } from './components/MemoForm';
import { MemoDetailModal } from './components/MemoDetailModal';
import type { Memo, MemoInput } from './types';
import { List, Sparkles, Plus } from 'lucide-react';

type Tab = 'list' | 'graph';
type PendingMemo = Omit<MemoInput, 'weight' | 'colorfulness'>;

function App() {
  const { memos, addMemo, editMemo, removeMemo } = useMemos();
  const [tab, setTab] = useState<Tab>('list');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [pendingMemo, setPendingMemo] = useState<PendingMemo | null>(null);
  const [selectedMemo, setSelectedMemo] = useState<Memo | null>(null);

  const handleFormSubmit = (input: PendingMemo) => {
    setIsFormOpen(false);
    setPendingMemo(input);
    setTab('graph'); // 位置決めのためグラフビューへ遷移
  };

  const handleConfirmPlacement = async (weight: number, colorfulness: number) => {
    if (!pendingMemo) return;
    await addMemo({ ...pendingMemo, weight, colorfulness });
    setPendingMemo(null);
  };

  const handleDelete = async (id: string) => {
    await removeMemo(id);
    setSelectedMemo(null);
  };

  return (
    <div className="app">
      <header className="app-header">
        <button className={tab === 'list' ? 'active' : ''} onClick={() => setTab('list')}>
          <List size={24} />
        </button>
        <button className={tab === 'graph' ? 'active' : ''} onClick={() => setTab('graph')}>
          <Sparkles size={24} />
        </button>
      </header>

      <main className="app-main">
        {tab === 'list' && <MemoList memos={memos} onSelectMemo={setSelectedMemo} />}
        {tab === 'graph' && (
          <MemoGraph
            memos={memos}
            pendingMemo={pendingMemo}
            onConfirmPlacement={handleConfirmPlacement}
            onCancelPlacement={() => setPendingMemo(null)}
            onUpdatePosition={(id, weight, colorfulness) => editMemo(id, { weight, colorfulness })}
            onSelectMemo={setSelectedMemo}
          />
        )}
      </main>

      {!pendingMemo && (
        <button className="fab" onClick={() => setIsFormOpen(true)} aria-label="新規メモ">
          <Plus size={36} />
        </button>
      )}

      {isFormOpen && <MemoForm onSubmit={handleFormSubmit} onCancel={() => setIsFormOpen(false)} />}
      {selectedMemo && (
        <MemoDetailModal memo={selectedMemo} onClose={() => setSelectedMemo(null)} onDelete={handleDelete} />
      )}
    </div>
  );
}

export default App;