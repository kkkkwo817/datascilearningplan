# Module 05: 客戶分群實驗室 (Customer Segmentation Lab)

## 📊 模組概述
- **學習目標**: 建立可落地的客戶分群體系，覆蓋特徵工程、聚類建模、品質評估、群組畫像與策略落地。
- **數據科學概念**: K-means、層次聚類、DBSCAN、特徵縮放、降維（PCA/UMAP）、聚類評估（Silhouette/DBI）。
- **應用場景**: 精準行銷、客戶運營（促活/召回/加價/交叉銷售）、產品推薦、風險控制。
- **難度等級**: ⭐⭐⭐⭐
- **預計學習時間**: 5 天
- **前置知識**: 統計基礎、距離度量、特徵工程、可視化基礎、Python/JS 數據處理。

## 🎯 功能規格

### 核心功能
- ✅ 特徵空間構建（RFM×行為）與標準化
- ✅ K-means/層次/DBSCAN 多算法分群
- ✅ 最佳 K 選擇（肘部法則/輪廓係數/DBI）
- ✅ 分群畫像與業務標籤生成
- ✅ 分群可視化（PCA/UMAP 降維散點、雷達圖、箱形圖）
- ✅ 策略模擬與效果預估（uplift/回本週期）

### ACTION BUTTONS 設計

| 按鈕名稱 | 學習概念 | 技術實現 | 預期效果 | 完成狀態 |
|---------|---------|---------|---------|---------|
| `生成特徵空間` | RFM×行為特徵 | 缺失處理、縮放、合併寬表 | 特徵檢視與質量報告 | ✅ |
| `執行KMeans` | 中心式聚類 | 多 K 迭代、收斂檢查 | 產生 labels 與中心點 | ✅ |
| `層次聚類` | 凝聚式聚類 | linkage: ward/average | 分群樹型結構與結果 | ✅ |
| `DBSCAN掃描` | 密度式聚類 | 參數網格：eps、min_samples | 噪聲/核心點分佈 | ✅ |
| `最佳K評估` | 模型選擇 | SSE/Silhouette/DBI | 輸出建議 K 與報告 | ✅ |
| `生成群組標籤` | 解釋性 | 指標閾值與規則 | 人性化群組標籤 | ✅ |

*完成狀態: ⭐ 未開始 | 🟡 進行中 | ✅ 已完成*

### 互動參數設計
- **kRange**: 2..10 - 選擇候選群數 - 整數
- **scaler**: standard|minmax - 縮放方法 - 枚舉
- **algo**: kmeans|hierarchical|dbscan - 聚類算法 - 枚舉
- **eps**: 0.1..2.0 - DBSCAN 半徑 - 浮點
- **minSamples**: 3..50 - DBSCAN 最小點數 - 整數
- **dimReduction**: none|pca|umap - 視覺化降維 - 枚舉

## 🔬 數據科學知識點

### 理論基礎
#### 核心算法/方法
- **K-means**: 最小化群內平方和（SSE），EM-like 迭代：指派→更新。
- **Agglomerative Clustering**: 由下而上合併，連結方式影響結果（Ward 適合歐式距離）。
- **DBSCAN**: 基於密度的連通區域發現，適合非球狀、含噪聲資料。

#### 數學原理
- **SSE**: \( \sum_{j=1}^{k} \sum_{x_i \in C_j} \lVert x_i - \mu_j \rVert^2 \)
- **輪廓係數**: \( s(i) = \frac{b(i) - a(i)}{\max\{a(i), b(i)\}} \)
- **Davies-Bouldin**: 群內離散與群間距比值的平均。

#### 統計概念
- 特徵縮放對距離度量的影響；共線性與降維；異常值對 DBSCAN 的意義。

### 實際應用
#### 金融場景應用
- 分群營銷：高價值忠誠、潛力新客、價格敏感、沉睡喚醒。
- 風險管理：異常行為/詐欺樣態初篩（配合密度聚類）。

#### 業務價值
- 更高轉化與留存；提升 ARPU 與 LTV；更精準的資源投放。

#### 決策支持
- 分群→策略→評估的閉環：A/B 測試或歷史類比計算 uplift。

## 💻 技術實現

### 組件架構（概念設計）
```typescript
interface SegmentationParams {
  scaler: 'standard' | 'minmax'
  algorithm: 'kmeans' | 'hierarchical' | 'dbscan'
  kRange: number[]
  eps?: number
  minSamples?: number
  dimReduction?: 'none' | 'pca' | 'umap'
}

interface ClusterReport {
  labels: number[]
  metrics: { k?: number; silhouette?: number; dbi?: number; sse?: number }
  centers?: number[][]
  friendlyNames?: string[]
}
```

### 數據處理邏輯（TypeScript示例）
```typescript
export function standardize(features: number[][]): number[][] {
  const cols = features[0].length
  const means = Array.from({ length: cols }, (_, j) => features.reduce((s, r) => s + r[j], 0) / features.length)
  const stds = Array.from({ length: cols }, (_, j) => Math.sqrt(features.reduce((s, r) => s + Math.pow(r[j] - means[j], 2), 0) / features.length) || 1)
  return features.map(row => row.map((v, j) => (v - means[j]) / stds[j]))
}
```

```typescript
export function kmeans(X: number[][], k: number, maxIter = 100): { labels: number[]; centers: number[][] } {
  const n = X.length
  const d = X[0].length
  let centers = Array.from({ length: k }, () => X[Math.floor(Math.random() * n)])
  let labels = new Array(n).fill(0)
  for (let it = 0; it < maxIter; it++) {
    // assign
    for (let i = 0; i < n; i++) {
      let best = 0, bestDist = Infinity
      for (let c = 0; c < k; c++) {
        const dist = Math.sqrt(X[i].reduce((s, v, j) => s + (v - centers[c][j]) ** 2, 0))
        if (dist < bestDist) { bestDist = dist; best = c }
      }
      labels[i] = best
    }
    // update
    const newCenters = Array.from({ length: k }, () => Array(d).fill(0))
    const counts = Array(k).fill(0)
    for (let i = 0; i < n; i++) { counts[labels[i]]++; for (let j = 0; j < d; j++) newCenters[labels[i]][j] += X[i][j] }
    for (let c = 0; c < k; c++) if (counts[c] > 0) for (let j = 0; j < d; j++) newCenters[c][j] /= counts[c]
    if (JSON.stringify(newCenters) === JSON.stringify(centers)) break
    centers = newCenters
  }
  return { labels, centers }
}
```

### 視覺化配置（ECharts示例）
```javascript
const radarOption = (clusterStats, indicator) => ({
  tooltip: {},
  legend: { data: clusterStats.map(s => s.name) },
  radar: { indicator },
  series: [{ type: 'radar', data: clusterStats.map(s => ({ name: s.name, value: s.values })) }]
})
```

### 核心算法實現（評估指標）
```typescript
export function silhouetteScore(X: number[][], labels: number[]): number {
  // 省略：可調用現成庫，這裡僅放接口佈局供對齊
  return 0.0
}
```

## 🎨 視覺化技術

### 圖表類型選擇
- 主要圖表：
  - 降維散點（PCA/UMAP）：群組可分性與邊界
  - 雷達圖：群組中心特徵對比
- 輔助圖表：
  - 箱形圖：群內分佈與異常值
  - 環圖：群組占比

### 設計原則
- 色彩：群組固定色盤，標示噪聲群為灰色
- 布局：左側參數面板，右側主視覺；下方群組摘要卡片
- 互動：懸浮顯示群組指標、框選高亮、點選顯示畫像

## 🧪 測試與驗證

### 數據驗證
- 邊界：全零/缺失/極端值；單一群情況；高噪聲密度
- 性能：1萬樣本×10特徵在1s內完成一次 KMeans 指派-更新

### 學習效果驗證
- 能解釋各指標與算法差異
- 能產出合理群組標籤與策略

### 應用場景練習
- 新客啟動、沉睡召回、VIP 維繫、價格敏感群策略

## 📝 學習筆記（留白）
- Day 1..5 規劃與反思

## ✅ 完成檢查清單
- ✅ 核心功能全可用
- ✅ ACTION BUTTONS 全通
- ✅ 視覺化達標
- ✅ 指標與策略產出清晰

## 🎉 實現亮點

### 核心技術成就
1. **完整機器學習流水線**: 實現了從特徵工程到模型評估的完整聚類分析流程
2. **多算法支援**: K-Means、階層聚類、DBSCAN 三種主流聚類算法完整實現
3. **智能評估系統**: 輪廓係數、Davies-Bouldin指數、SSE肘部法則等多維度模型評估
4. **業務智能標籤**: 基於規則引擎的客戶群組智能標籤生成系統（🏆冠軍、💎忠誠、🌟潛力等）
5. **ROI預估引擎**: 整合轉換率預測和營銷策略建議的投資回報率計算系統

### 技術創新特色
1. **PCA視覺化**: 高維客戶特徵的主成分分析降維視覺化
2. **即時數據模擬**: 基於數學函數的客戶行為數據即時生成
3. **互動式分析**: 支援群組選擇、篩選、詳情展開等豐富的用戶互動
4. **企業級特徵**: 8維擴展客戶特徵（終身價值、風險評分、季節性指數等）
5. **策略自動化**: 根據群組特徵自動生成差異化營銷策略建議

### 教育價值實現
1. **理論實踐結合**: 數學原理到實際應用的完整學習路徑
2. **漸進式學習**: 從基礎概念到高級應用的階段性教學設計
3. **視覺化教學**: 圖表和數據並重的直觀學習體驗
4. **商業案例**: 真實業務場景的客戶分群實戰演練
5. **技能轉移**: 可直接應用於實際工作的專業技能培養

### 技術架構優勢
1. **模組化設計**: 高內聚低耦合的組件架構，便於維護和擴展
2. **性能優化**: 大數據處理和即時計算的性能最佳化
3. **類型安全**: 完整的 TypeScript 類型定義，確保代碼品質
4. **響應式UI**: 適配不同螢幕尺寸的響應式設計
5. **主題支援**: 深色/淺色主題自動切換的視覺一致性

## 📚 後續擴展方向

### 進階功能開發
- [ ] 時間序列聚類分析
- [ ] 半監督學習客戶分群
- [ ] 深度學習嵌入式聚類
- [ ] 實時流式聚類更新
- [ ] A/B測試效果驗證

### 業務應用深化
- [ ] 跨平台客戶數據整合
- [ ] 多維度客戶旅程分析
- [ ] 預測性客戶生命週期管理
- [ ] 動態定價策略優化
- [ ] 個性化推薦系統整合 