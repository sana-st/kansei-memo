export interface Memo {
  id: string;
  title: string;           // 必須
  text?: string;
  url?: string;
  imageBlob?: Blob;        // 撮影 or ファイル選択した画像の実体
  weight: number;          // 縦軸: 0(軽い) 〜 100(重い)
  colorfulness: number;    // 横軸: 0(モノトーン) 〜 100(カラフル)
  createdAt: number;
  updatedAt: number;
}

// 新規作成時に渡す入力型（id・日時はstorage側で採番するため除外）
export type MemoInput = Omit<Memo, 'id' | 'createdAt' | 'updatedAt'>;