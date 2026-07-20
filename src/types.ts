export interface Memo {
  id: string;
  title: string;           // 必須
  text?: string;
  url?: string;
  imageBlob?: Blob;        // 撮影 or ファイル選択した画像の実体
  hue: number;             // 色相: 0〜360（作成時にスライダーで選択）
  weight: number;          // 縦軸: 0(軽い) 〜 100(重い) => 明度に対応
  colorfulness: number;    // 横軸: 0(モノトーン) 〜 100(カラフル) => 彩度に対応
  createdAt: number;
  updatedAt: number;
}

// 新規作成時に渡す入力型（id・日時はstorage側で採番するため除外）
export type MemoInput = Omit<Memo, 'id' | 'createdAt' | 'updatedAt'>;