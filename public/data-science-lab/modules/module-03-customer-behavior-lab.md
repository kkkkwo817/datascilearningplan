# MODULE 03: 客戶行為分析實驗室

## 📋 模組資訊

| 項目 | 詳細內容 |
|------|----------|
| **模組名稱** | 客戶行為分析實驗室 |
| **模組編號** | MODULE-03 |
| **所屬階段** | 第一階段：數據基礎操作 |
| **預計學習時間** | 3天 |
| **難度等級** | ⭐⭐⭐ (中等) |
| **前置要求** | MODULE-01, MODULE-02 |

## 🎯 學習目標

### 主要目標
- 理解客戶行為分析的核心概念和方法論
- 掌握RFM模型的理論基礎和實際應用
- 學會使用數據科學方法進行客戶細分
- 建立客戶生命週期價值(CLV)評估模型

### 技能獲得
完成本模組後，你將能夠：
- ✅ 實施RFM分析模型
- ✅ 進行客戶細分和價值評估
- ✅ 計算客戶生命週期價值
- ✅ 建立客戶流失預警系統
- ✅ 設計客戶旅程分析

## 💡 核心概念

### 1. RFM分析模型
RFM是客戶價值分析的經典模型，包含三個維度：

#### Recency (最近購買時間)
- **定義**: 客戶最後一次購買距今的天數
- **評分標準**: 時間越短分數越高 (1-5分)
- **業務意義**: 反映客戶的活躍程度

#### Frequency (購買頻率)
- **定義**: 客戶在特定時間內的購買次數
- **評分標準**: 頻率越高分數越高 (1-5分)
- **業務意義**: 反映客戶的忠誠度

#### Monetary (消費金額)
- **定義**: 客戶累計消費的總金額
- **評分標準**: 金額越高分數越高 (1-5分)
- **業務意義**: 反映客戶的經濟價值

### 2. 客戶細分策略

#### 五大客戶群體
1. **冠軍客戶 (Champions)**: RFM總分12-15分
   - 特徵: 最近購買、高頻率、高消費
   - 策略: VIP服務、早鳥優惠、忠誠度計劃

2. **忠誠客戶 (Loyal Customers)**: RFM總分9-11分
   - 特徵: 購買穩定、中高消費
   - 策略: 個性化推薦、會員升級

3. **潛力客戶 (Potential Loyalists)**: RFM總分6-8分
   - 特徵: 近期活躍、有成長潛力
   - 策略: 培育計劃、交叉銷售

4. **新客戶 (New Customers)**: RFM總分4-5分
   - 特徵: 新近加入、待觀察
   - 策略: 歡迎體驗、引導購買

5. **流失風險客戶 (At Risk)**: RFM總分1-3分
   - 特徵: 長期未購買、低活躍
   - 策略: 召回活動、特別優惠

### 3. 客戶生命週期價值 (CLV)

#### CLV計算公式
```
CLV = (平均訂單價值 × 購買頻率 × 毛利率 × 客戶生命週期) - 客戶獲取成本
```

#### 影響因素
- **平均訂單價值 (AOV)**: 每次購買的平均金額
- **購買頻率**: 單位時間內的購買次數
- **客戶生命週期**: 客戶關係的持續時間
- **毛利率**: 產品或服務的利潤率
- **客戶獲取成本 (CAC)**: 獲得新客戶的成本

## 🛠️ 技術實現

### 數據結構設計

#### 客戶行為事實表
```sql
CREATE TABLE customer_behavior_facts (
    customer_id VARCHAR(50) NOT NULL,
    transaction_date DATE NOT NULL,
    order_amount DECIMAL(10,2),
    product_category VARCHAR(100),
    channel VARCHAR(50),
    payment_method VARCHAR(50),
    discount_amount DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### RFM分析結果表
```sql
CREATE TABLE rfm_analysis_results (
    customer_id VARCHAR(50) PRIMARY KEY,
    analysis_date DATE NOT NULL,
    recency_days INTEGER,
    frequency_count INTEGER,
    monetary_amount DECIMAL(12,2),
    r_score INTEGER CHECK (r_score BETWEEN 1 AND 5),
    f_score INTEGER CHECK (f_score BETWEEN 1 AND 5),
    m_score INTEGER CHECK (m_score BETWEEN 1 AND 5),
    rfm_score VARCHAR(3),
    customer_segment VARCHAR(50),
    clv_predicted DECIMAL(12,2),
    churn_risk_level VARCHAR(20)
);
```

### 核心算法實現

#### 1. RFM評分計算
```typescript
interface RFMMetrics {
  recency: number;
  frequency: number;
  monetary: number;
}

interface RFMScore {
  rScore: number;
  fScore: number;
  mScore: number;
  totalScore: number;
  rfmString: string;
}

const calculateRFMScore = (metrics: RFMMetrics): RFMScore => {
  // Recency評分 (天數越少分數越高)
  const rScore = metrics.recency <= 30 ? 5 :
                 metrics.recency <= 60 ? 4 :
                 metrics.recency <= 90 ? 3 :
                 metrics.recency <= 180 ? 2 : 1;

  // Frequency評分 (次數越多分數越高)
  const fScore = metrics.frequency >= 15 ? 5 :
                 metrics.frequency >= 10 ? 4 :
                 metrics.frequency >= 6 ? 3 :
                 metrics.frequency >= 3 ? 2 : 1;

  // Monetary評分 (金額越高分數越高)
  const mScore = metrics.monetary >= 30000 ? 5 :
                 metrics.monetary >= 20000 ? 4 :
                 metrics.monetary >= 10000 ? 3 :
                 metrics.monetary >= 5000 ? 2 : 1;

  return {
    rScore,
    fScore,
    mScore,
    totalScore: rScore + fScore + mScore,
    rfmString: `${rScore}${fScore}${mScore}`
  };
};
```

#### 2. 客戶細分邏輯
```typescript
type CustomerSegment = '冠軍客戶' | '忠誠客戶' | '潛力客戶' | '新客戶' | '流失風險客戶';

const segmentCustomer = (rfmScore: RFMScore): CustomerSegment => {
  const { totalScore, rScore, fScore, mScore } = rfmScore;

  // 特殊規則：近期活躍但總分不高的新客戶
  if (rScore >= 4 && totalScore < 6) {
    return '新客戶';
  }

  // 基於總分的基本分類
  if (totalScore >= 12) return '冠軍客戶';
  if (totalScore >= 9) return '忠誠客戶';
  if (totalScore >= 6) return '潛力客戶';
  if (totalScore >= 4) return '新客戶';
  return '流失風險客戶';
};
```

#### 3. CLV預測模型
```typescript
interface CLVInput {
  avgOrderValue: number;
  purchaseFrequency: number;
  customerLifespan: number;
  grossMargin: number;
  customerAcquisitionCost: number;
}

const calculateCLV = (input: CLVInput): number => {
  const {
    avgOrderValue,
    purchaseFrequency,
    customerLifespan,
    grossMargin,
    customerAcquisitionCost
  } = input;

  // 基本CLV計算
  const grossRevenue = avgOrderValue * purchaseFrequency * customerLifespan;
  const grossProfit = grossRevenue * grossMargin;
  const netCLV = grossProfit - customerAcquisitionCost;

  return Math.max(0, netCLV); // 確保CLV不為負數
};
```

## 📊 數據分析流程

### 第一步：數據收集與清理
1. **數據源識別**
   - 交易數據表
   - 客戶註冊信息
   - 行為追蹤數據

2. **數據清理規則**
   - 移除測試訂單
   - 處理退款和取消訂單
   - 統一客戶標識符

3. **數據驗證**
   - 檢查數據完整性
   - 識別異常值
   - 驗證業務邏輯

### 第二步：RFM指標計算
```sql
-- RFM基礎指標計算
WITH customer_metrics AS (
  SELECT 
    customer_id,
    DATEDIFF(CURRENT_DATE, MAX(transaction_date)) as recency_days,
    COUNT(DISTINCT transaction_date) as frequency_count,
    SUM(order_amount) as monetary_amount
  FROM customer_behavior_facts
  WHERE transaction_date >= DATE_SUB(CURRENT_DATE, INTERVAL 12 MONTH)
  GROUP BY customer_id
)
SELECT 
  customer_id,
  recency_days,
  frequency_count,
  monetary_amount,
  -- R分數計算
  CASE 
    WHEN recency_days <= 30 THEN 5
    WHEN recency_days <= 60 THEN 4
    WHEN recency_days <= 90 THEN 3
    WHEN recency_days <= 180 THEN 2
    ELSE 1
  END as r_score,
  -- F分數計算
  CASE 
    WHEN frequency_count >= 15 THEN 5
    WHEN frequency_count >= 10 THEN 4
    WHEN frequency_count >= 6 THEN 3
    WHEN frequency_count >= 3 THEN 2
    ELSE 1
  END as f_score,
  -- M分數計算
  CASE 
    WHEN monetary_amount >= 30000 THEN 5
    WHEN monetary_amount >= 20000 THEN 4
    WHEN monetary_amount >= 10000 THEN 3
    WHEN monetary_amount >= 5000 THEN 2
    ELSE 1
  END as m_score
FROM customer_metrics;
```

### 第三步：客戶細分與分析
```sql
-- 客戶細分結果統計
SELECT 
  customer_segment,
  COUNT(*) as customer_count,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) as percentage,
  AVG(monetary_amount) as avg_monetary,
  AVG(frequency_count) as avg_frequency,
  AVG(recency_days) as avg_recency
FROM rfm_analysis_results
GROUP BY customer_segment
ORDER BY avg_monetary DESC;
```

## 📈 業務應用案例

### 案例1：電商平台客戶細分
**背景**: 某電商平台有10萬客戶，需要制定差異化行銷策略

**分析過程**:
1. 收集12個月交易數據
2. 計算每位客戶的RFM指標
3. 進行客戶細分分析

**發現**:
- 冠軍客戶 (5%): 貢獻45%營收
- 忠誠客戶 (15%): 貢獻35%營收
- 潛力客戶 (25%): 貢獻15%營收
- 新客戶 (20%): 貢獻4%營收
- 流失風險客戶 (35%): 貢獻1%營收

**策略制定**:
- **冠軍客戶**: VIP專線、優先客服、專屬優惠
- **忠誠客戶**: 生日禮品、積分加倍、早鳥特權
- **潛力客戶**: 個性化推薦、限時優惠、新品試用
- **新客戶**: 新手指南、首購優惠、客服引導
- **流失風險客戶**: 挽回郵件、特價促銷、問卷調查

### 案例2：SaaS企業客戶健康度監控
**背景**: SaaS公司需要監控客戶健康度，預防客戶流失

**指標體系**:
- **R**: 最後登入距今天數
- **F**: 月活躍天數
- **M**: 月付費金額

**預警系統**:
- 高風險: R>30天, F<5天, M<500元
- 中風險: R>14天, F<10天, M<1000元
- 低風險: R<7天, F>15天, M>2000元

**干預措施**:
- 自動化郵件提醒
- 客戶成功團隊跟進
- 使用培訓課程
- 功能升級建議

## 🔬 進階分析技術

### 1. 同期群分析 (Cohort Analysis)
追蹤不同時期加入的客戶群體的留存和價值變化

```sql
-- 月度同期群留存分析
WITH cohort_data AS (
  SELECT 
    customer_id,
    DATE_TRUNC('month', MIN(transaction_date)) as cohort_month,
    DATE_TRUNC('month', transaction_date) as transaction_month
  FROM customer_behavior_facts
  GROUP BY customer_id, DATE_TRUNC('month', transaction_date)
)
SELECT 
  cohort_month,
  transaction_month,
  COUNT(DISTINCT customer_id) as active_customers,
  EXTRACT(MONTH FROM AGE(transaction_month, cohort_month)) as month_number
FROM cohort_data
GROUP BY cohort_month, transaction_month
ORDER BY cohort_month, transaction_month;
```

### 2. 客戶旅程分析
分析客戶從認知到購買再到忠誠的完整路徑

#### 漏斗階段定義
1. **發現**: 首次訪問網站
2. **興趣**: 瀏覽產品頁面
3. **考慮**: 加入購物車
4. **購買**: 完成首次交易
5. **回購**: 第二次購買

### 3. 預測性分析
使用機器學習模型預測客戶行為

#### 流失預測模型特徵
- RFM分數
- 網站互動行為
- 客服聯繫記錄
- 產品使用深度
- 季節性購買模式

## 📚 學習資源

### 必讀文獻
1. "Database Marketing" by Robert C. Blattberg
2. "Customer Analytics for Dummies" by Jeff Sauro
3. "Predictive Analytics" by Eric Siegel

### 線上課程
1. Coursera: "Customer Analytics" (Wharton)
2. edX: "Analytics for Decision Making" (Babson)
3. Udacity: "Predictive Analytics for Business"

### 實用工具
- **分析工具**: Python (pandas, scikit-learn), R, SQL
- **視覺化**: Tableau, PowerBI, matplotlib, seaborn
- **平台**: Google Analytics, Mixpanel, Amplitude

## ✅ 模組檢核清單

### 理論掌握
- [ ] 理解RFM模型的三個維度
- [ ] 掌握客戶細分的業務邏輯
- [ ] 熟悉CLV計算方法
- [ ] 了解客戶旅程分析框架

### 技術實現
- [ ] 能夠寫出RFM分析SQL查詢
- [ ] 實現客戶細分算法
- [ ] 建立CLV預測模型
- [ ] 設計客戶健康度儀表板

### 業務應用
- [ ] 制定差異化客戶策略
- [ ] 設計客戶流失預警系統
- [ ] 優化客戶生命週期管理
- [ ] 提升客戶價值和留存率

## 🚀 下一步學習

完成本模組後，建議學習：
- **MODULE-04**: 產品銷售分布器
- **MODULE-05**: 客戶分群實驗室 (機器學習聚類)
- **MODULE-06**: 商品關聯分析器

## 📝 作業與實戰

### 作業1: RFM分析實作
使用提供的模擬數據，完成完整的RFM分析流程

### 作業2: 客戶策略設計
基於分析結果，為不同客戶群體設計具體的行銷策略

### 作業3: CLV模型建構
建立一個簡單的CLV預測模型，並評估其準確性

---

**文檔版本**: v1.0  
**最後更新**: 2025-08-10  
**作者**: 數據科學學習實驗室