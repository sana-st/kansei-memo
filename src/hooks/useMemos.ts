import { useState, useEffect, useCallback } from 'react';
import type { Memo, MemoInput } from '../types';
import * as storage from '../storage';

export function useMemos() {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    const all = await storage.getAllMemos();
    setMemos(all);
    setLoading(false);
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const addMemo = useCallback(
    async (input: MemoInput) => {
      await storage.createMemo(input);
      await reload();
    },
    [reload]
  );

  const editMemo = useCallback(
    async (id: string, patch: Partial<MemoInput>) => {
      await storage.updateMemo(id, patch);
      await reload();
    },
    [reload]
  );

  const removeMemo = useCallback(
    async (id: string) => {
      await storage.deleteMemo(id);
      await reload();
    },
    [reload]
  );

  return { memos, loading, addMemo, editMemo, removeMemo };
}