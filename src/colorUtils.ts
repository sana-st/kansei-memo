// 固定値
export const DOT_SIZE = 16; // px
export const DOT_OPACITY = 0.85;

// weight(重い⇔軽い) → 明度、colorfulness(モノトーン⇔カラフル) → 彩度 に変換
export function getDotColor(hue: number, colorfulness: number, weight: number): string {
  const saturation = colorfulness; // 0(モノトーン) 〜 100(カラフル)
  const lightness = 85 - (weight / 100) * 55; // weight=0→85%(明るい) 〜 weight=100→30%(暗い)
  return `hsl(${hue} ${saturation}% ${lightness}%)`;
}

// フォームのプレビュー用（座標が決まる前に、色相だけを確認する）
export function getHuePreviewColor(hue: number): string {
  return `hsl(${hue} 70% 55%)`;
}