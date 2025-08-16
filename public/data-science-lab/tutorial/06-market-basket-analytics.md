# 教程 06: 商品關聯分析與市場籃實戰指南

## 📚 學習目標

本教程將帶你深入了解商品關聯分析的實務操作，從數據挖掘算法到商業應用，讓你能夠：

- 掌握關聯規則挖掘的核心算法原理和實現
- 理解 Apriori 和 FP-Growth 算法的適用場景
- 學會市場籃分析在零售業的實際應用
- 建立智能商品推薦和交叉銷售系統
- 實現商業價值最大化的購物籃優化策略

## 🎯 為什麼要進行商品關聯分析？

### 商業價值
- **交叉銷售**: 識別商品間的購買關聯，提升客單價
- **商品陳列**: 優化商品擺放位置，提高轉換率
- **庫存管理**: 預測關聯商品需求，降低缺貨風險
- **促銷策略**: 設計有效的套餐和捆綁銷售方案

### 實際案例
一家大型超市通過商品關聯分析發現：
- 購買尿布的客戶有70%同時購買啤酒
- 實施關聯商品陳列後，啤酒銷量提升35%
- 推出"新爸爸套餐"後，平均客單價增加15%
- 整體毛利率提升12%，年度增收500萬元

## 🔍 商品關聯分析框架

### 1. 數據準備階段
```
交易數據收集 → 數據清理 → 商品編碼 → 購物籃構建
```

### 2. 挖掘分析階段
```
頻繁項目集生成 → 關聯規則提取 → 置信度計算 → 提升度評估
```

### 3. 業務應用階段
```
商業規則解釋 → 推薦系統構建 → 陳列策略優化 → 效果監控
```

## 📊 關聯規則挖掘算法詳解

### Apriori 算法

#### 理論基礎

Apriori 算法是最經典的關聯規則挖掘算法，基於頻繁項目集的性質：
> 如果一個項目集是頻繁的，那麼它的所有子集也必須是頻繁的

#### 算法步驟

1. **掃描數據庫**: 計算所有單個商品的支持度
2. **生成候選集**: 基於頻繁 k-項目集生成 (k+1)-項目集候選
3. **剪枝操作**: 移除不滿足最小支持度的項目集
4. **重複迭代**: 直到無法生成新的頻繁項目集

**實作程式碼**:
```typescript
const aprioriAlgorithm = (transactions: TransactionData[], minSupport: number) => {
  const totalTransactions = transactions.length
  
  // 步驟1: 計算單個商品支持度
  const itemSupport = new Map<string, number>()
  transactions.forEach(transaction => {
    transaction.items.forEach(item => {
      const count = itemSupport.get(item) || 0
      itemSupport.set(item, count + 1)
    })
  })
  
  // 步驟2: 過濾頻繁1-項目集
  const frequentItems = Array.from(itemSupport.entries())
    .filter(([item, count]) => count / totalTransactions >= minSupport)
    .map(([item]) => item)
  
  // 步驟3: 生成頻繁2-項目集
  const itemPairs = []
  for (let i = 0; i < frequentItems.length; i++) {
    for (let j = i + 1; j < frequentItems.length; j++) {
      itemPairs.push([frequentItems[i], frequentItems[j]])
    }
  }
  
  // 步驟4: 計算2-項目集支持度
  const pairSupport = new Map<string, number>()
  itemPairs.forEach(([itemA, itemB]) => {
    const pairKey = [itemA, itemB].sort().join(',')
    let count = 0
    
    transactions.forEach(transaction => {
      if (transaction.items.includes(itemA) && transaction.items.includes(itemB)) {
        count++
      }
    })
    
    const support = count / totalTransactions
    if (support >= minSupport) {
      pairSupport.set(pairKey, support)
    }
  })
  
  return { itemSupport, pairSupport, frequentItems }
}
```

**優缺點分析**:

| 優點 | 缺點 |
|------|------|
| 算法邏輯簡單清晰 | 需要多次掃描數據庫 |
| 容易實現和理解 | 候選集生成開銷大 |
| 結果完整準確 | 對稀疏數據處理效率低 |

### FP-Growth 算法

#### 理論基礎

FP-Growth (Frequent Pattern Growth) 算法通過構建 FP-Tree 來避免候選集生成：
> 將交易數據壓縮成緊湊的樹狀結構，然後直接從樹中挖掘頻繁模式

#### 核心數據結構

**FP-Tree 節點**:
```typescript
class FPNode {
  item: string              // 商品名稱
  count: number            // 出現次數
  parent: FPNode | null    // 父節點
  children: Map<string, FPNode>  // 子節點映射
  nodeLink: FPNode | null  // 同名節點鏈接
  
  constructor(item: string, count: number, parent: FPNode | null) {
    this.item = item
    this.count = count
    this.parent = parent
    this.children = new Map()
    this.nodeLink = null
  }
}
```

#### 算法實現

```typescript
const fpGrowthAlgorithm = (transactions: TransactionData[], minSupport: number) => {
  const totalTransactions = transactions.length
  
  // 步驟1: 計算商品頻率並排序
  const itemFrequency = new Map<string, number>()
  transactions.forEach(transaction => {
    transaction.items.forEach(item => {
      const count = itemFrequency.get(item) || 0
      itemFrequency.set(item, count + 1)
    })
  })
  
  // 步驟2: 過濾並按頻率排序
  const frequentItems = Array.from(itemFrequency.entries())
    .filter(([item, count]) => count / totalTransactions >= minSupport)
    .sort((a, b) => b[1] - a[1])
    .map(([item]) => item)
  
  // 步驟3: 構建FP-Tree
  const root = new FPNode('root', 0, null)
  const headerTable = new Map<string, FPNode>()
  
  transactions.forEach(transaction => {
    // 按頻率排序交易中的商品
    const sortedItems = transaction.items
      .filter(item => frequentItems.includes(item))
      .sort((a, b) => frequentItems.indexOf(a) - frequentItems.indexOf(b))
    
    // 插入到FP-Tree
    let currentNode = root
    sortedItems.forEach(item => {
      if (currentNode.children.has(item)) {
        currentNode.children.get(item)!.count++
      } else {
        const newNode = new FPNode(item, 1, currentNode)
        currentNode.children.set(item, newNode)
        
        // 更新header table鏈接
        if (headerTable.has(item)) {
          let node = headerTable.get(item)!
          while (node.nodeLink) {
            node = node.nodeLink
          }
          node.nodeLink = newNode
        } else {
          headerTable.set(item, newNode)
        }
      }
      currentNode = currentNode.children.get(item)!
    })
  })
  
  return { root, headerTable }
}
```

**優勢特點**:
- **空間效率**: 相比 Apriori 大幅減少內存使用
- **掃描次數**: 只需要兩次數據庫掃描
- **無候選集**: 直接從樹結構挖掘模式
- **適用場景**: 特別適合處理大規模稠密數據

## 🛠️ 關聯規則評估指標

### 1. 支持度 (Support)

**定義**: 項目集在所有交易中出現的頻率
```
Support(A ∪ B) = |交易包含A和B| / |總交易數|
```

**商業意義**: 反映商品組合的流行程度
- 高支持度: 常見的購買組合，值得重點關注
- 低支持度: 小眾組合，可能有特殊商業價值

### 2. 信心度 (Confidence)

**定義**: 在包含前項的交易中，後項出現的概率
```
Confidence(A → B) = Support(A ∪ B) / Support(A)
```

**商業意義**: 反映推薦的準確性
- 高信心度: 強烈的購買關聯，推薦成功率高
- 低信心度: 弱關聯，推薦效果有限

### 3. 提升度 (Lift)

**定義**: 實際信心度與期望信心度的比值
```
Lift(A → B) = Confidence(A → B) / Support(B)
```

**解釋標準**:
- Lift > 1: 正相關，A的出現促進B的銷售
- Lift = 1: 無關聯，A和B獨立
- Lift < 1: 負相關，A的出現抑制B的銷售

**實作計算**:
```typescript
const calculateAssociationRules = (
  itemSupport: Map<string, number>,
  pairSupport: Map<string, number>,
  totalTransactions: number,
  minConfidence: number,
  minLift: number
): AssociationRule[] => {
  const rules: AssociationRule[] = []
  
  pairSupport.forEach((support, pairKey) => {
    const [itemA, itemB] = pairKey.split(',')
    
    // 計算A → B規則
    const supportA = (itemSupport.get(itemA) || 0) / totalTransactions
    const supportB = (itemSupport.get(itemB) || 0) / totalTransactions
    
    const confidenceAB = support / supportA
    const liftAB = confidenceAB / supportB
    
    if (confidenceAB >= minConfidence && liftAB >= minLift) {
      rules.push({
        antecedent: [itemA],
        consequent: [itemB],
        support,
        confidence: confidenceAB,
        lift: liftAB,
        conviction: (1 - supportB) / (1 - confidenceAB)
      })
    }
  })
  
  return rules.sort((a, b) => b.lift - a.lift)
}
```

## 📈 市場籃分析實戰案例

### 案例1: 便利商店商品擺放優化

**背景**: 24小時便利商店需要優化商品陳列提升銷售

**數據分析**:
```sql
-- 分析高頻商品組合
WITH frequent_combinations AS (
  SELECT 
    product_a,
    product_b,
    COUNT(*) as co_occurrence,
    COUNT(*) * 1.0 / (SELECT COUNT(*) FROM transactions) as support,
    COUNT(*) * 1.0 / COUNT(DISTINCT CASE WHEN products LIKE '%' + product_a + '%' THEN transaction_id END) as confidence
  FROM (
    SELECT 
      transaction_id,
      products,
      p1.product_name as product_a,
      p2.product_name as product_b
    FROM transactions t
    CROSS JOIN products p1
    CROSS JOIN products p2
    WHERE products LIKE '%' + p1.product_name + '%'
      AND products LIKE '%' + p2.product_name + '%'
      AND p1.product_name < p2.product_name
  ) combinations
  GROUP BY product_a, product_b
  HAVING COUNT(*) >= 10
)
SELECT 
  product_a + ' → ' + product_b as rule,
  support,
  confidence,
  confidence / (SELECT COUNT(DISTINCT transaction_id) * 1.0 / COUNT(*) 
                FROM transactions 
                WHERE products LIKE '%' + product_b + '%') as lift
FROM frequent_combinations
WHERE confidence >= 0.3
ORDER BY lift DESC, confidence DESC
```

**發現洞察**:
1. **咖啡 → 三明治**: 提升度2.3，信心度65%
2. **香菸 → 打火機**: 提升度4.1，信心度78%
3. **報紙 → 口香糖**: 提升度1.8，信心度45%

**實施策略**:
- 將咖啡和三明治陳列在相鄰位置
- 在收銀台附近放置打火機和口香糖
- 設計早餐套餐組合促銷

**業務成果**:
- 平均客單價提升18%
- 交叉銷售率從12%提升至28%
- 月營業額增長25%

### 案例2: 電商平台智能推薦系統

**系統架構**:
```typescript
// 即時推薦引擎
class RealtimeRecommendationEngine {
  private associationRules: AssociationRule[]
  private productCatalog: Map<string, ProductInfo>
  
  constructor(rules: AssociationRule[], catalog: Map<string, ProductInfo>) {
    this.associationRules = rules
    this.productCatalog = catalog
  }
  
  // 基於當前購物車生成推薦
  generateRecommendations(currentCart: string[]): ProductRecommendation[] {
    const recommendations = new Map<string, number>()
    
    this.associationRules.forEach(rule => {
      // 檢查前項是否在購物車中
      const antecedentInCart = rule.antecedent.every(item => 
        currentCart.includes(item)
      )
      
      if (antecedentInCart) {
        rule.consequent.forEach(item => {
          if (!currentCart.includes(item)) {
            const score = rule.lift * rule.confidence
            const existingScore = recommendations.get(item) || 0
            recommendations.set(item, existingScore + score)
          }
        })
      }
    })
    
    return Array.from(recommendations.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([productId, score]) => ({
        productId,
        productName: this.productCatalog.get(productId)?.name || productId,
        recommendationScore: score,
        reason: this.getRecommendationReason(productId, currentCart)
      }))
  }
  
  private getRecommendationReason(productId: string, cart: string[]): string {
    const relevantRules = this.associationRules.filter(rule =>
      rule.consequent.includes(productId) &&
      rule.antecedent.some(item => cart.includes(item))
    )
    
    if (relevantRules.length > 0) {
      const bestRule = relevantRules.sort((a, b) => b.lift - a.lift)[0]
      return `購買 ${bestRule.antecedent.join(', ')} 的客戶有 ${(bestRule.confidence * 100).toFixed(0)}% 也會購買此商品`
    }
    
    return '基於其他客戶的購買模式推薦'
  }
}
```

**A/B 測試結果**:
- 推薦點擊率: 從2.3%提升至8.7%
- 推薦轉換率: 從0.8%提升至3.2%
- 平均訂單金額: 提升32%
- 用戶滿意度: 提升15%

## 🔬 進階應用技術

### 1. 序列模式挖掘

分析客戶購買的時間序列模式：

```sql
-- 分析季節性購買模式
WITH seasonal_patterns AS (
  SELECT 
    EXTRACT(MONTH FROM order_date) as month,
    product_category,
    COUNT(*) as purchase_count,
    AVG(order_amount) as avg_amount
  FROM orders o
  JOIN order_items oi ON o.order_id = oi.order_id
  JOIN products p ON oi.product_id = p.product_id
  GROUP BY EXTRACT(MONTH FROM order_date), product_category
),
monthly_totals AS (
  SELECT month, SUM(purchase_count) as total_month_purchases
  FROM seasonal_patterns
  GROUP BY month
)
SELECT 
  sp.month,
  sp.product_category,
  sp.purchase_count,
  ROUND(sp.purchase_count * 100.0 / mt.total_month_purchases, 2) as market_share_pct,
  sp.avg_amount
FROM seasonal_patterns sp
JOIN monthly_totals mt ON sp.month = mt.month
ORDER BY sp.month, market_share_pct DESC
```

### 2. 多層關聯規則

探索不同商品類別層級的關聯：

```typescript
// 多層次關聯分析
interface HierarchicalProduct {
  id: string
  name: string
  category: string
  subcategory: string
  brand: string
}

const analyzeMultilevelAssociations = (
  transactions: TransactionData[],
  products: HierarchicalProduct[]
) => {
  const productMap = new Map(products.map(p => [p.id, p]))
  
  // 按不同層級分析
  const analyses = {
    // 商品級別
    product: analyzeAtLevel(transactions, (item) => item),
    
    // 品牌級別  
    brand: analyzeAtLevel(transactions, (item) => 
      productMap.get(item)?.brand || item
    ),
    
    // 類別級別
    category: analyzeAtLevel(transactions, (item) =>
      productMap.get(item)?.category || item
    ),
    
    // 子類別級別
    subcategory: analyzeAtLevel(transactions, (item) =>
      productMap.get(item)?.subcategory || item
    )
  }
  
  return analyses
}

const analyzeAtLevel = (
  transactions: TransactionData[], 
  levelMapper: (item: string) => string
) => {
  const transformedTransactions = transactions.map(t => ({
    ...t,
    items: [...new Set(t.items.map(levelMapper))] // 去重
  }))
  
  return aprioriAlgorithm(transformedTransactions, 0.01)
}
```

### 3. 關聯規則的統計顯著性檢驗

使用卡方檢驗驗證關聯規則的統計顯著性：

```typescript
// 卡方檢驗
const chiSquareTest = (
  itemA: string,
  itemB: string, 
  transactions: TransactionData[]
) => {
  const total = transactions.length
  let a = 0, b = 0, c = 0, d = 0
  
  transactions.forEach(transaction => {
    const hasA = transaction.items.includes(itemA)
    const hasB = transaction.items.includes(itemB)
    
    if (hasA && hasB) a++
    else if (hasA && !hasB) b++
    else if (!hasA && hasB) c++
    else d++
  })
  
  const expectedA = ((a + b) * (a + c)) / total
  const expectedB = ((a + b) * (c + d)) / total
  const expectedC = ((b + d) * (a + c)) / total
  const expectedD = ((b + d) * (c + d)) / total
  
  const chiSquare = 
    Math.pow(a - expectedA, 2) / expectedA +
    Math.pow(b - expectedB, 2) / expectedB +
    Math.pow(c - expectedC, 2) / expectedC +
    Math.pow(d - expectedD, 2) / expectedD
  
  // 自由度為1的卡方臨界值 (α=0.05)
  const criticalValue = 3.841
  const isSignificant = chiSquare > criticalValue
  
  return {
    chiSquare: chiSquare.toFixed(4),
    isSignificant,
    pValue: calculatePValue(chiSquare, 1)
  }
}
```

## 📊 商業洞察與策略制定

### ROI 計算框架

```typescript
// 關聯規則ROI評估
interface BusinessImpactAnalysis {
  rule: AssociationRule
  currentRevenue: number
  potentialUplift: number
  implementationCost: number
  expectedROI: number
  paybackPeriod: number
}

const calculateBusinessImpact = (
  rule: AssociationRule,
  transactionData: TransactionData[],
  avgOrderIncrease: number = 15, // 平均客單價提升15元
  implementationCostPerRule: number = 5000 // 每條規則實施成本
): BusinessImpactAnalysis => {
  const affectedTransactions = Math.floor(
    rule.support * transactionData.length
  )
  
  const currentRevenue = affectedTransactions * avgOrderIncrease
  const potentialUplift = affectedTransactions * rule.confidence * avgOrderIncrease * 0.7 // 70%實現率
  
  const expectedROI = ((potentialUplift - implementationCostPerRule) / implementationCostPerRule) * 100
  const paybackPeriod = implementationCostPerRule / (potentialUplift / 12) // 月度回收期
  
  return {
    rule,
    currentRevenue,
    potentialUplift: Math.round(potentialUplift),
    implementationCost: implementationCostPerRule,
    expectedROI: Math.round(expectedROI),
    paybackPeriod: Math.round(paybackPeriod * 10) / 10
  }
}
```

### 實施優先級排序

```typescript
// 規則實施優先級評分
const calculateImplementationPriority = (
  businessImpact: BusinessImpactAnalysis
): number => {
  const { rule, expectedROI, paybackPeriod, potentialUplift } = businessImpact
  
  // 多因子評分模型
  const liftScore = Math.min(rule.lift / 3, 1) * 30        // 提升度權重30%
  const confidenceScore = rule.confidence * 25              // 信心度權重25%
  const roiScore = Math.min(expectedROI / 200, 1) * 20     // ROI權重20%
  const revenueScore = Math.min(potentialUplift / 10000, 1) * 15  // 營收權重15%
  const paybackScore = Math.max(0, (12 - paybackPeriod) / 12) * 10  // 回收期權重10%
  
  return Math.round(liftScore + confidenceScore + roiScore + revenueScore + paybackScore)
}
```

## 🚀 實踐建議

### 1. 實施路線圖

#### 第1-2週：數據準備
- 建立標準化的交易數據收集流程
- 清理和預處理歷史交易數據
- 建立商品主檔和類別體系
- 設計數據品質監控機制

#### 第3-4週：算法實現
- 實現 Apriori 和 FP-Growth 算法
- 開發關聯規則評估指標計算
- 建立參數調優和模型驗證機制
- 進行算法性能測試和優化

#### 第5-6週：業務應用
- 開發智能推薦系統原型
- 設計商品陳列優化建議
- 建立交叉銷售機會識別系統
- 創建商業洞察報告模板

#### 第7-8週：系統整合
- 整合到現有業務系統
- 建立即時推薦API服務
- 開發管理後台和監控儀表板
- 進行用戶培訓和文檔建立

### 2. 常見挑戰與解決方案

#### 挑戰1: 數據稀疏性問題
**問題**: 大多數商品組合的支持度很低，難以發現有意義的規則
**解決方案**:
- 使用商品分類層級進行聚合分析
- 採用興趣度等替代指標
- 結合時間窗口和用戶群體分析
- 引入外部知識進行規則補充

#### 挑戰2: 計算效率和擴展性
**問題**: 大規模數據處理時算法效率低下
**解決方案**:
- 使用分散式計算框架 (Spark)
- 實現增量式關聯規則更新
- 採用取樣技術進行快速原型驗證
- 優化數據結構和存儲格式

#### 挑戰3: 業務解釋性和可操作性
**問題**: 挖掘出的規則難以理解和應用
**解決方案**:
- 建立規則業務價值評估體系
- 提供自然語言的規則解釋
- 設計可視化的規則探索工具
- 建立規則到行動的映射機制

### 3. 效果評估與持續優化

#### A/B 測試設計
```typescript
// A/B測試評估框架
interface ABTestConfig {
  testName: string
  controlGroup: 'no_recommendations'
  treatmentGroup: 'association_based_recommendations'
  trafficSplit: 0.5
  duration: number // 天數
  primaryMetric: 'conversion_rate' | 'avg_order_value' | 'revenue_per_visitor'
  secondaryMetrics: string[]
}

const evaluateRecommendationEffectiveness = async (
  testConfig: ABTestConfig,
  testResults: TestResults
) => {
  const { controlMetrics, treatmentMetrics } = testResults
  
  const lift = {
    conversionRate: ((treatmentMetrics.conversionRate - controlMetrics.conversionRate) / controlMetrics.conversionRate) * 100,
    avgOrderValue: ((treatmentMetrics.avgOrderValue - controlMetrics.avgOrderValue) / controlMetrics.avgOrderValue) * 100,
    revenuePerVisitor: ((treatmentMetrics.revenuePerVisitor - controlMetrics.revenuePerVisitor) / controlMetrics.revenuePerVisitor) * 100
  }
  
  return {
    isSignificant: await performStatisticalTest(controlMetrics, treatmentMetrics),
    lift,
    recommendation: generateRecommendation(lift, testConfig.primaryMetric)
  }
}
```

#### 持續監控指標
- **規則覆蓋率**: 能夠觸發推薦的交易比例
- **推薦採納率**: 用戶接受推薦的比例
- **增量收益**: 推薦系統帶來的額外收入
- **用戶滿意度**: 推薦準確性的用戶回饋評分

## 📝 總結

商品關聯分析是現代零售業不可或缺的核心技術。通過系統性的關聯規則挖掘和市場籃分析，企業能夠：

1. **精準識別商品關聯**，優化商品組合和陳列策略
2. **建立智能推薦系統**，提升客戶體驗和購買轉換
3. **制定交叉銷售策略**，增加客單價和整體營收
4. **驅動數據決策**，基於客觀分析優化業務運營

成功實施的關鍵在於選擇合適的挖掘算法、建立完善的評估體系、制定可執行的商業策略，並建立持續優化機制。

---

**下一步學習**: 進入 [教程07: 銷售漏斗分析與轉化優化](./07-sales-funnel-analytics.md)

**相關模組**: [MODULE-06: 商品關聯分析器](../modules/module-06-market-basket-analyzer.md)