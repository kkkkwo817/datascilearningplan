# MODULE 04: 產品銷售分布器

## 📋 模組資訊

| 項目 | 詳細內容 |
|------|----------|
| **模組名稱** | 產品銷售分布器 |
| **模組編號** | MODULE-04 |
| **所屬階段** | 第一階段：數據基礎操作 |
| **預計學習時間** | 4天 |
| **難度等級** | ⭐⭐⭐⭐ (中高) |
| **前置要求** | MODULE-01, MODULE-02, MODULE-03 |

## 🎯 學習目標

### 主要目標
- 掌握ABC分析法的理論基礎和實際應用
- 理解帕累托法則在產品管理中的運用
- 學會建立產品績效評估體系
- 掌握庫存優化的數學模型和算法

### 技能獲得
完成本模組後，你將能夠：
- ✅ 實施ABC產品分類分析
- ✅ 建立產品績效評估矩陣
- ✅ 進行產品生命週期管理
- ✅ 設計智能庫存優化系統
- ✅ 應用EOQ經濟訂購量模型

## 💡 核心概念

### 1. ABC分析法 (Always Better Control)

ABC分析是基於帕累托法則(80/20原則)的庫存分類管理方法。

#### 分類標準
- **A類產品 (約20%數量)**
  - 貢獻80%的銷售額
  - 高價值、高重要性
  - 需要嚴格控制和重點管理

- **B類產品 (約30%數量)**  
  - 貢獻15%的銷售額
  - 中等價值、中等重要性
  - 需要適度控制和定期檢查

- **C類產品 (約50%數量)**
  - 貢獻5%的銷售額
  - 低價值、低重要性
  - 可以簡化管理流程

#### 管理策略
```
A類產品：高頻監控 + 精確預測 + 低安全庫存
B類產品：定期監控 + 系統預測 + 中等安全庫存  
C類產品：週期監控 + 簡化預測 + 高安全庫存
```

### 2. 經濟訂購量模型 (EOQ)

EOQ是確定最佳訂購批量的數學模型，目標是最小化總庫存成本。

#### 基本假設
- 需求率恆定且已知
- 前置時間恆定
- 沒有數量折扣
- 沒有缺貨情況

#### 數學公式
```
EOQ = √(2DS/H)

其中：
D = 年需求量
S = 每次訂購成本
H = 單位存貨年持有成本
```

#### 相關公式
```bash
# 年訂購次數
N = D / EOQ

# 平均庫存
Average Inventory = EOQ / 2

# 總年成本
TC = (D/EOQ) × S + (EOQ/2) × H
```

### 3. 安全庫存計算

安全庫存用於緩解需求和前置時間不確定性的風險。

#### 計算公式
```
SS = Z × σ_LT

其中：
Z = 服務水準對應的標準正態分布值
σ_LT = 前置時間期間需求的標準差
```

#### 服務水準與Z值對應表
| 服務水準 | Z值 | 缺貨概率 |
|----------|-----|----------|
| 90% | 1.28 | 10% |
| 95% | 1.65 | 5% |
| 99% | 2.33 | 1% |
| 99.9% | 3.09 | 0.1% |

### 4. 產品生命週期管理

#### 四個階段特徵
1. **導入期 (Introduction)**
   - 銷量緩慢成長
   - 高推廣成本
   - 有限的競爭

2. **成長期 (Growth)**
   - 銷量快速成長
   - 市場接受度提高
   - 競爭者進入

3. **成熟期 (Maturity)**
   - 銷量成長趨緩
   - 市場飽和
   - 激烈競爭

4. **衰退期 (Decline)**
   - 銷量下降
   - 利潤萎縮
   - 考慮淘汰

## 🛠️ 技術實現

### 數據結構設計

#### 產品銷售事實表
```sql
CREATE TABLE product_sales_facts (
    product_id VARCHAR(50) NOT NULL,
    product_name VARCHAR(200),
    category VARCHAR(100),
    sales_date DATE NOT NULL,
    quantity_sold INTEGER,
    unit_price DECIMAL(10,2),
    cost_price DECIMAL(10,2),
    total_revenue DECIMAL(12,2),
    total_cost DECIMAL(12,2),
    inventory_level INTEGER,
    supplier_id VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_product_date (product_id, sales_date),
    INDEX idx_category_date (category, sales_date)
);
```

#### ABC分析結果表
```sql
CREATE TABLE abc_analysis_results (
    product_id VARCHAR(50) PRIMARY KEY,
    analysis_date DATE NOT NULL,
    total_revenue DECIMAL(12,2),
    total_quantity INTEGER,
    revenue_rank INTEGER,
    cumulative_revenue DECIMAL(12,2),
    cumulative_percentage DECIMAL(5,2),
    abc_category ENUM('A', 'B', 'C'),
    contribution_score DECIMAL(8,4),
    
    INDEX idx_analysis_date (analysis_date),
    INDEX idx_abc_category (abc_category)
);
```

#### 庫存優化建議表
```sql
CREATE TABLE inventory_recommendations (
    recommendation_id VARCHAR(50) PRIMARY KEY,
    product_id VARCHAR(50) NOT NULL,
    recommendation_type ENUM('reorder', 'safety_stock', 'excess_inventory'),
    priority_level ENUM('high', 'medium', 'low'),
    current_stock INTEGER,
    recommended_action VARCHAR(500),
    eoq_quantity INTEGER,
    safety_stock_level INTEGER,
    estimated_savings DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (product_id) REFERENCES product_sales_facts(product_id)
);
```

### 核心算法實現

#### 1. ABC分析算法
```typescript
interface ProductSalesData {
  productId: string;
  productName: string;
  totalRevenue: number;
  totalQuantity: number;
  category: string;
}

interface ABCAnalysisResult extends ProductSalesData {
  revenueRank: number;
  cumulativeRevenue: number;
  cumulativePercentage: number;
  abcCategory: 'A' | 'B' | 'C';
  contributionScore: number;
}

const performABCAnalysis = (products: ProductSalesData[]): ABCAnalysisResult[] => {
  // 1. 按營收排序
  const sortedProducts = [...products].sort((a, b) => b.totalRevenue - a.totalRevenue);
  
  // 2. 計算總營收
  const totalRevenue = sortedProducts.reduce((sum, product) => sum + product.totalRevenue, 0);
  
  // 3. 計算累積百分比並分類
  let cumulativeRevenue = 0;
  
  return sortedProducts.map((product, index) => {
    cumulativeRevenue += product.totalRevenue;
    const cumulativePercentage = (cumulativeRevenue / totalRevenue) * 100;
    
    // ABC分類邏輯
    let abcCategory: 'A' | 'B' | 'C';
    if (cumulativePercentage <= 80) {
      abcCategory = 'A';
    } else if (cumulativePercentage <= 95) {
      abcCategory = 'B';
    } else {
      abcCategory = 'C';
    }
    
    return {
      ...product,
      revenueRank: index + 1,
      cumulativeRevenue,
      cumulativePercentage,
      abcCategory,
      contributionScore: (product.totalRevenue / totalRevenue) * 100
    };
  });
};
```

#### 2. EOQ計算模型
```typescript
interface EOQInput {
  annualDemand: number;        // D: 年需求量
  orderingCost: number;        // S: 訂購成本
  unitCost: number;           // 單位成本
  holdingCostRate: number;    // H: 持有成本率 (如 0.25 = 25%)
}

interface EOQResult {
  eoq: number;                // 經濟訂購量
  totalAnnualCost: number;    // 年總成本
  orderingCost: number;       // 年訂購成本
  holdingCost: number;        // 年持有成本
  numberOfOrders: number;     // 年訂購次數
  timeBetweenOrders: number;  // 訂購間隔天數
}

const calculateEOQ = (input: EOQInput): EOQResult => {
  const { annualDemand, orderingCost, unitCost, holdingCostRate } = input;
  
  // 年持有成本
  const holdingCostPerUnit = unitCost * holdingCostRate;
  
  // EOQ計算
  const eoq = Math.sqrt((2 * annualDemand * orderingCost) / holdingCostPerUnit);
  
  // 相關指標計算
  const numberOfOrders = annualDemand / eoq;
  const timeBetweenOrders = 365 / numberOfOrders;
  
  // 成本計算
  const annualOrderingCost = (annualDemand / eoq) * orderingCost;
  const annualHoldingCost = (eoq / 2) * holdingCostPerUnit;
  const totalAnnualCost = annualOrderingCost + annualHoldingCost;
  
  return {
    eoq: Math.round(eoq),
    totalAnnualCost: Math.round(totalAnnualCost),
    orderingCost: Math.round(annualOrderingCost),
    holdingCost: Math.round(annualHoldingCost),
    numberOfOrders: Math.round(numberOfOrders * 100) / 100,
    timeBetweenOrders: Math.round(timeBetweenOrders * 100) / 100
  };
};
```

#### 3. 安全庫存計算
```typescript
interface SafetyStockInput {
  leadTimeDays: number;           // 前置時間(天)
  dailyDemandMean: number;        // 日平均需求
  dailyDemandStdDev: number;      // 日需求標準差
  serviceLevel: number;           // 服務水準 (0.95 = 95%)
}

const calculateSafetyStock = (input: SafetyStockInput): number => {
  const { leadTimeDays, dailyDemandMean, dailyDemandStdDev, serviceLevel } = input;
  
  // 服務水準對應的Z值
  const zValues: { [key: number]: number } = {
    0.90: 1.28,
    0.95: 1.65,
    0.99: 2.33,
    0.999: 3.09
  };
  
  const zScore = zValues[serviceLevel] || 1.65; // 默認95%服務水準
  
  // 前置時間期間需求的標準差
  const leadTimeDemandStdDev = dailyDemandStdDev * Math.sqrt(leadTimeDays);
  
  // 安全庫存計算
  const safetyStock = zScore * leadTimeDemandStdDev;
  
  return Math.round(safetyStock);
};
```

#### 4. 產品生命週期判斷
```typescript
interface ProductLifecycleInput {
  daysSinceLaunch: number;
  currentSalesVelocity: number;     // 當前銷售速度
  peakSalesVelocity: number;        // 歷史峰值銷售速度
  salesTrend: 'increasing' | 'stable' | 'decreasing';
}

type LifecycleStage = '導入期' | '成長期' | '成熟期' | '衰退期';

const determineLifecycleStage = (input: ProductLifecycleInput): LifecycleStage => {
  const { daysSinceLaunch, currentSalesVelocity, peakSalesVelocity, salesTrend } = input;
  
  const velocityRatio = currentSalesVelocity / peakSalesVelocity;
  
  // 導入期：上市90天內
  if (daysSinceLaunch <= 90) {
    return '導入期';
  }
  
  // 成長期：銷售速度持續增長且接近峰值
  if (salesTrend === 'increasing' && velocityRatio > 0.7) {
    return '成長期';
  }
  
  // 衰退期：銷售速度顯著下降
  if (salesTrend === 'decreasing' && velocityRatio < 0.3) {
    return '衰退期';
  }
  
  // 成熟期：其他情況
  return '成熟期';
};
```

## 📊 數據分析流程

### 第一步：數據準備與清理
```sql
-- 產品銷售數據清理和聚合
WITH clean_sales_data AS (
  SELECT 
    product_id,
    product_name,
    category,
    SUM(quantity_sold) as total_quantity,
    SUM(total_revenue) as total_revenue,
    SUM(total_cost) as total_cost,
    COUNT(DISTINCT sales_date) as sales_days,
    MIN(sales_date) as first_sale_date,
    MAX(sales_date) as last_sale_date
  FROM product_sales_facts
  WHERE sales_date >= DATE_SUB(CURRENT_DATE, INTERVAL 12 MONTH)
    AND quantity_sold > 0
    AND total_revenue > 0
  GROUP BY product_id, product_name, category
)
SELECT 
  *,
  total_revenue - total_cost as total_profit,
  (total_revenue - total_cost) / total_revenue as profit_margin,
  total_quantity / sales_days as avg_daily_sales,
  DATEDIFF(CURRENT_DATE, last_sale_date) as days_since_last_sale
FROM clean_sales_data
WHERE total_quantity >= 10;  -- 過濾低銷量產品
```

### 第二步：ABC分析執行
```sql
-- ABC分析SQL實現
WITH revenue_ranked AS (
  SELECT 
    product_id,
    product_name,
    category,
    total_revenue,
    total_quantity,
    ROW_NUMBER() OVER (ORDER BY total_revenue DESC) as revenue_rank,
    SUM(total_revenue) OVER () as grand_total_revenue
  FROM clean_sales_data
),
cumulative_analysis AS (
  SELECT 
    *,
    SUM(total_revenue) OVER (ORDER BY revenue_rank) as cumulative_revenue,
    (SUM(total_revenue) OVER (ORDER BY revenue_rank) / grand_total_revenue) * 100 as cumulative_percentage
  FROM revenue_ranked
)
SELECT 
  *,
  CASE 
    WHEN cumulative_percentage <= 80 THEN 'A'
    WHEN cumulative_percentage <= 95 THEN 'B'
    ELSE 'C'
  END as abc_category,
  (total_revenue / grand_total_revenue) * 100 as contribution_percentage
FROM cumulative_analysis
ORDER BY revenue_rank;
```

### 第三步：庫存優化分析
```sql
-- EOQ和安全庫存計算
WITH inventory_analysis AS (
  SELECT 
    p.product_id,
    p.product_name,
    p.avg_daily_sales * 365 as annual_demand,
    500 as ordering_cost,  -- 假設訂購成本
    p.unit_price,
    0.25 as holding_cost_rate,  -- 假設25%持有成本率
    7 as lead_time_days,  -- 假設7天前置時間
    STDDEV(p.daily_sales) as demand_std_dev
  FROM (
    SELECT 
      product_id,
      product_name,
      AVG(unit_price) as unit_price,
      AVG(quantity_sold) as avg_daily_sales,
      quantity_sold as daily_sales
    FROM product_sales_facts
    WHERE sales_date >= DATE_SUB(CURRENT_DATE, INTERVAL 6 MONTH)
    GROUP BY product_id, product_name, sales_date
  ) p
  GROUP BY product_id, product_name
)
SELECT 
  product_id,
  product_name,
  annual_demand,
  -- EOQ計算
  ROUND(SQRT((2 * annual_demand * ordering_cost) / (unit_price * holding_cost_rate))) as eoq,
  -- 安全庫存計算 (95%服務水準)
  ROUND(1.65 * demand_std_dev * SQRT(lead_time_days)) as safety_stock,
  -- 再訂購點
  ROUND((annual_demand / 365) * lead_time_days + (1.65 * demand_std_dev * SQRT(lead_time_days))) as reorder_point
FROM inventory_analysis;
```

## 📈 業務應用案例

### 案例1：零售連鎖店庫存優化
**背景**: 某零售連鎖店有3000個SKU，庫存管理效率低下

**問題分析**:
- 庫存周轉率僅3.2次/年
- 缺貨率達15%
- 庫存持有成本佔營收的8%

**解決方案**:
1. **ABC分析實施**
   - A類產品(300個)：每日監控，高頻補貨
   - B類產品(900個)：每週監控，定期補貨
   - C類產品(1800個)：每月監控，批量補貨

2. **EOQ模型應用**
   - 重新計算所有SKU的最佳訂購量
   - 建立動態安全庫存機制
   - 優化供應商訂購頻率

**實施結果**:
- 庫存周轉率提升至4.8次/年
- 缺貨率降低至8%
- 庫存持有成本降低至5.5%
- 年度節省成本120萬元

### 案例2：電商平台長尾產品管理
**背景**: 電商平台有10萬個商品，長尾產品管理複雜

**挑戰**:
- 80%商品屬於C類低銷量產品
- 倉儲成本高昂
- 供應鏈管理複雜

**策略制定**:
1. **A類產品 (2萬個)**
   - 自營庫存，快速配送
   - 精準需求預測
   - 多供應商備選方案

2. **B類產品 (3萬個)**
   - 中等庫存水位
   - 定期補貨機制
   - 區域倉儲分布

3. **C類產品 (5萬個)**
   - 代發模式或預售模式
   - 供應商直接發貨
   - 簡化庫存管理

**成果**:
- 倉儲成本降低30%
- 配送時效提升25%
- 客戶滿意度提升至95%

### 案例3：製造業原物料管理
**背景**: 製造企業需要管理500種原物料

**ABC分析結果**:
- A類(50種)：貢獻80%採購金額
- B類(150種)：貢獻15%採購金額  
- C類(300種)：貢獻5%採購金額

**差異化管理策略**:

| 類別 | 庫存政策 | 供應商管理 | 監控頻率 |
|------|----------|------------|----------|
| A類 | 低庫存+高服務 | 戰略夥伴關係 | 每日 |
| B類 | 中等庫存 | 合格供應商池 | 每週 |
| C類 | 高庫存+簡化管理 | 價格導向採購 | 每月 |

## 🔬 進階分析技術

### 1. 動態ABC分析
考慮季節性和趨勢變化的動態分類方法

```python
import pandas as pd
import numpy as np
from sklearn.cluster import KMeans

def dynamic_abc_analysis(sales_data, time_window_months=3):
    """
    動態ABC分析，考慮時間窗口內的銷售趨勢
    """
    results = []
    
    for month in range(time_window_months, len(sales_data.columns)):
        # 計算移動窗口內的銷售數據
        window_data = sales_data.iloc[:, month-time_window_months:month]
        monthly_revenue = window_data.sum(axis=1)
        
        # 執行ABC分析
        abc_result = perform_abc_analysis(monthly_revenue)
        abc_result['analysis_month'] = sales_data.columns[month]
        
        results.append(abc_result)
    
    return pd.concat(results)
```

### 2. 多維度產品分析
結合銷售量、利潤率、成長率的綜合分析

```python
def multi_dimensional_analysis(products_df):
    """
    多維度產品分析：銷售量 × 利潤率 × 成長率
    """
    # 標準化各維度數據
    from sklearn.preprocessing import StandardScaler
    
    features = ['revenue', 'profit_margin', 'growth_rate']
    scaler = StandardScaler()
    scaled_features = scaler.fit_transform(products_df[features])
    
    # K-means聚類
    kmeans = KMeans(n_clusters=4, random_state=42)
    products_df['cluster'] = kmeans.fit_predict(scaled_features)
    
    # 定義集群標籤
    cluster_labels = {
        0: '明星產品',    # 高銷售、高利潤、高成長
        1: '現金牛',      # 高銷售、高利潤、低成長
        2: '問題產品',    # 低銷售、低利潤、高成長  
        3: '瘦狗產品'     # 低銷售、低利潤、低成長
    }
    
    products_df['product_type'] = products_df['cluster'].map(cluster_labels)
    return products_df
```

### 3. 需求預測與庫存優化整合
將需求預測結果整合到庫存優化決策中

```python
from statsmodels.tsa.exponential_smoothing import ExponentialSmoothing

def integrated_inventory_optimization(historical_sales, lead_time=7, service_level=0.95):
    """
    整合需求預測的庫存優化
    """
    # 需求預測
    model = ExponentialSmoothing(historical_sales, trend='add', seasonal='add', seasonal_periods=12)
    fitted_model = model.fit()
    forecast = fitted_model.forecast(steps=30)  # 預測未來30天
    
    # 計算預測誤差
    forecast_error = np.std(fitted_model.resid)
    
    # 調整安全庫存計算
    z_score = norm.ppf(service_level)
    safety_stock = z_score * forecast_error * np.sqrt(lead_time)
    
    # 動態EOQ計算
    annual_demand = forecast.mean() * 365
    eoq = calculate_eoq(annual_demand, ordering_cost=500, holding_cost_rate=0.25)
    
    return {
        'forecast_demand': forecast,
        'safety_stock': safety_stock,
        'eoq': eoq,
        'reorder_point': forecast.mean() * lead_time + safety_stock
    }
```

## 📚 學習資源

### 教科書推薦
1. **"庫存管理與控制"** - Chase, Jacobs & Aquilano
2. **"運營管理"** - Krajewski, Ritzman & Malhotra  
3. **"供應鏈管理基礎"** - Chopra & Meindl

### 學術論文
1. "Dynamic ABC Analysis" - Journal of Operations Management
2. "Multi-criteria Inventory Classification" - European Journal of Operational Research
3. "EOQ Models with Uncertain Demand" - Operations Research

### 線上資源
- **Coursera**: Supply Chain Management (Rutgers)
- **edX**: Introduction to Operations Management (Wharton)
- **MIT OpenCourseWare**: Operations Management

### 軟體工具
- **優化軟體**: CPLEX, Gurobi, OR-Tools
- **統計分析**: R, Python (SciPy, NumPy)
- **可視化**: Tableau, PowerBI, D3.js

## ✅ 模組檢核清單

### 理論掌握
- [ ] 理解ABC分析的理論基礎
- [ ] 掌握帕累托法則的應用
- [ ] 熟悉EOQ模型的假設和限制
- [ ] 了解安全庫存的計算方法

### 技術實現  
- [ ] 能夠實現ABC分析算法
- [ ] 會計算EOQ和安全庫存
- [ ] 能夠判斷產品生命週期階段
- [ ] 會設計庫存優化建議系統

### 業務應用
- [ ] 制定差異化庫存管理策略
- [ ] 設計產品組合優化方案
- [ ] 建立庫存預警機制
- [ ] 提供數據驅動的採購建議

### 進階技能
- [ ] 整合需求預測與庫存優化
- [ ] 進行多維度產品分析
- [ ] 設計動態ABC分析系統
- [ ] 建立庫存成本最優化模型

## 🚀 下一步學習

完成本模組後，建議學習：
- **MODULE-05**: 客戶分群實驗室 (機器學習聚類)
- **MODULE-06**: 商品關聯分析器 (Market Basket Analysis)
- **MODULE-07**: 銷售漏斗分析器 (轉化率優化)

## 📝 實戰作業

### 作業1: ABC分析實作
使用提供的產品銷售數據，完成完整的ABC分析流程並制定管理策略

### 作業2: EOQ模型應用
為給定的10個產品計算EOQ、安全庫存和再訂購點

### 作業3: 產品組合優化
基於ABC分析結果，設計一個產品組合優化方案

### 作業4: 庫存成本分析
分析當前庫存策略的成本結構，提出改進建議

---

**文檔版本**: v1.0  
**最後更新**: 2025-08-10  
**作者**: 數據科學學習實驗室