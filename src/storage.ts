import { get, set } from 'idb-keyval';
import type { Memo, MemoInput } from './types';

const STORAGE_KEY = 'memos';

export async function getAllMemos(): Promise<Memo[]> {
  const memos = await get<Memo[]>(STORAGE_KEY);
  return memos ?? [];
}

export async function createMemo(input: MemoInput): Promise<Memo> {
  const now = Date.now();
  const newMemo: Memo = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  };
  const memos = await getAllMemos();
  await set(STORAGE_KEY, [...memos, newMemo]);
  return newMemo;
}

// 内容編集・グラフ上のドラッグ移動、どちらもこれを使う
export async function updateMemo(id: string, patch: Partial<MemoInput>): Promise<void> {
  const memos = await getAllMemos();
  const updated = memos.map((m) =>
    m.id === id ? { ...m, ...patch, updatedAt: Date.now() } : m
  );
  await set(STORAGE_KEY, updated);
}

export async function deleteMemo(id: string): Promise<void> {
  const memos = await getAllMemos();
  await set(STORAGE_KEY, memos.filter((m) => m.id !== id));
}