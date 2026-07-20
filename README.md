# kansei-memo

縦軸（軽い⇔重い）・横軸（モノトーン⇔カラフル）の2軸グラフに、メモを直感的にプロットして整理できる、iOS向けのメモアプリ（PWA）です。

## コンセプト

タグや文字での分類ではなく、「なんとなくこのメモは軽い/重い」「モノトーンな気分/カラフルな気分」という感覚的な位置に、ドラッグでメモを配置していくことで、通常のリストとは違う視点でメモを見返せることを目指しています。

## 主な機能

- **リストビュー**: 登録順・タイトル順で並び替え可能な一覧表示
- **グラフビュー**: 2軸平面上にメモをドットとして表示。ドットの色の濃さ・大きさ・不透明度は、そのメモの`colorfulness`（カラフルさ）・`weight`（重さ）の値から動的に計算される
- **新規作成フロー**: 「＋」ボタン→タイトル・本文・URL・画像を入力→グラフ上をドラッグして位置を決定→登録、という一連の流れ
- **メモの編集**: グラフ上のドットをドラッグすることで、いつでも座標（軽さ/重さ・モノトーン/カラフルさ）を再調整可能
- **画像添付**: ファイル選択・カメラ撮影の両方に対応（`capture`属性をあえて外し、iOS標準のアクションシートで両方の選択肢を出す実装）
- **PWA対応**: ホーム画面に追加してスタンドアロンアプリとして起動可能。オフラインでも動作
- **背景デザイン**: グラフエリアの背景に、白ベースのパステルカラーのグラデーションを複数重ねた、宇宙・星雲のような柔らかい雰囲気の背景を採用

## 技術スタック

- **フレームワーク**: React + TypeScript（Vite）
- **PWA対応**: `vite-plugin-pwa`
- **データ永続化**: IndexedDB（`idb-keyval`でシンプルなAPIとして利用）
- **アイコン**: `lucide-react`
- **ホスティング**: GitHub Pages

## データモデル

```typescript
interface Memo {
  id: string;
  title: string;           // 必須
  text?: string;
  url?: string;
  imageBlob?: Blob;
  weight: number;          // 縦軸: 0(軽い) 〜 100(重い)
  colorfulness: number;    // 横軸: 0(モノトーン) 〜 100(カラフル)
  createdAt: number;
  updatedAt: number;
}
```

全メモは1つの配列としてIndexedDB内の`memos`というキーにまとめて保存されている。

## プロジェクト構成

```
kansei-memo/
├── index.html
├── vite.config.ts
├── src/
│   ├── main.tsx
│   ├── App.tsx           # 画面全体のフロー（状態管理）を担う親コンポーネント
│   ├── App.css
│   ├── color.css          # 色（背景色・アクセントカラー・テキストカラー等）の一元管理
│   ├── types.ts           # Memo / MemoInput の型定義
│   ├── storage.ts         # IndexedDB（idb-keyval）への読み書き
│   ├── hooks/
│   │   └── useMemos.ts    # storageとコンポーネントをつなぐカスタムフック
│   └── components/
│       ├── MemoList.tsx
│       ├── MemoGraph.tsx
│       ├── MemoForm.tsx
│       └── MemoDetailModal.tsx
```

アーキテクチャは「コンポーネント → カスタムフック → storage.ts（IndexedDB）」という素朴な3層構成。クリーンアーキテクチャのような、ストレージ実装を抽象化する層は現時点では導入していない。

## セットアップ

```bash
npm install
npm run dev
```

`http://localhost:5173` でローカル確認が可能。

## デプロイ（GitHub Pages）

```bash
npm run deploy
```

`https://<GitHubユーザー名>.github.io/kansei-memo/` で公開される。Service Worker（PWA機能）の関係上、iPhone実機での正しい動作確認にはHTTPS環境が必須。

## デザイン

Figma上に、リストビュー・グラフビューのモックアップを作成済み（配色は`color.css`の値と対応させている）。