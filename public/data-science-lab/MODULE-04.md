# MODULE 04: 產品銷售分布器

## 模組概述

本模組專注於產品銷售數據的深度分析，透過ABC分析、銷售分布統計和產品組合優化來幫助企業制定更精準的產品策略。學習者將掌握產品績效評估、庫存管理優化、以及數據驅動的產品決策技能。

## 學習目標

完成此模組後，你將能夠：
- 🎯 理解產品銷售分布的核心分析框架
- 📊 實施經典的ABC分析方法
- 🔍 識別明星產品、問題產品和潛力產品
- 📈 建立產品生命週期管理模型
- 🎨 視覺化產品銷售分布數據
- 🚀 提供基於數據的庫存和定價建議

## 核心技術概念

### 1. ABC分析法
- **A類產品** - 高價值產品，佔銷售額80%但數量僅20%
- **B類產品** - 中等價值產品，佔銷售額15%
- **C類產品** - 低價值產品，佔銷售額5%但數量達60%
- **帕累托法則** - 80/20原則在產品管理中的應用

### 2. 產品績效矩陣
- **銷售量 vs 利潤率** - 四象限產品分類
- **成長率 vs 市場份額** - BCG矩陣應用
- **週轉率 vs 貢獻度** - 庫存效率分析
- **生命週期 vs 趨勢** - 產品階段識別

### 3. 銷售分布統計
- **正態分布檢驗** - 產品銷售是否符合常態分布
- **長尾分布** - 識別小眾但重要的產品
- **季節性模式** - 產品銷售的時間週期性
- **異常值檢測** - 爆款產品和滯銷品識別

### 4. 庫存優化算法
- **安全庫存計算** - 基於銷售變異性
- **經濟訂購量** (EOQ) - 最佳訂購數量模型
- **庫存週轉率** - 庫存效率指標
- **缺貨風險評估** - 庫存不足的風險量化

## 實戰練習

### 練習 1: ABC產品分類器
建立完整的ABC分析系統：
- 自動化產品分類算法
- 動態閾值調整功能
- 分類結果視覺化
- 管理建議生成

### 練習 2: 產品績效儀表板
創建綜合產品績效監控：
- 多維度績效指標
- 實時銷售追蹤
- 競品比較分析
- 預警系統設置

### 練習 3: 銷售分布分析
實施統計分析工具：
- 分布形狀檢驗
- 異常值檢測算法
- 趨勢預測模型
- 季節性分解

### 練習 4: 庫存最佳化建議器
建立智能庫存管理：
- EOQ模型實作
- 安全庫存計算
- 補貨時點提醒
- 成本效益分析

## 數據模型設計

### 產品銷售事實表
```sql
-- product_sales_facts
product_id           STRING    -- 產品唯一標識
product_name         STRING    -- 產品名稱
category             STRING    -- 產品類別
sales_date           DATE      -- 銷售日期
quantity_sold        INTEGER   -- 銷售數量
unit_price           DECIMAL   -- 單價
total_revenue        DECIMAL   -- 總收入
cost_price           DECIMAL   -- 成本價
profit_margin        DECIMAL   -- 利潤率
inventory_level      INTEGER   -- 庫存水位
reorder_point        INTEGER   -- 再訂購點
supplier_id          STRING    -- 供應商ID
```

### ABC分析結果表
```sql
-- abc_analysis_results
product_id           STRING    -- 產品ID
analysis_date        DATE      -- 分析日期
abc_category         STRING    -- ABC分類 (A/B/C)
cumulative_revenue   DECIMAL   -- 累積收入
cumulative_percent   DECIMAL   -- 累積百分比
revenue_rank         INTEGER   -- 收入排名
quantity_rank        INTEGER   -- 數量排名
contribution_score   DECIMAL   -- 貢獻度評分
```

### 產品生命週期表
```sql
-- product_lifecycle
product_id           STRING    -- 產品ID
launch_date          DATE      -- 上市日期
lifecycle_stage      STRING    -- 生命週期階段
days_since_launch    INTEGER   -- 上市天數
peak_sales_date      DATE      -- 銷售高峰日期
decline_start_date   DATE      -- 衰退開始日期
predicted_eol_date   DATE      -- 預測下市日期
stage_confidence     DECIMAL   -- 階段判斷信心度
```

## 關鍵指標 (KPIs)

### 產品價值指標
- **產品貢獻度** - 個別產品對總營收的貢獻百分比
- **平均銷售價格** (ASP) - 產品的平均售價趨勢
- **毛利率** - 產品的獲利能力指標

### 庫存效率指標
- **庫存週轉率** - 存貨轉換為銷售的速度
- **庫存持有成本** - 維持庫存的總成本
- **缺貨率** - 產品缺貨的頻率和持續時間

### 產品競爭力指標
- **市場佔有率** - 產品在細分市場的地位
- **銷售成長率** - 產品銷售的增長趨勢
- **客戶滿意度** - 產品的客戶評價指標

## 業務洞察案例

### 案例 1: ABC庫存最佳化
**情境**: 電子零售商庫存成本過高，需要優化庫存結構
**分析方法**: 使用ABC分析重新分類3000個SKU
**發現**: 
- A類產品(200個)貢獻82%營收，但僅佔15%庫存投資
- C類產品(2000個)佔庫存投資60%，但僅貢獻8%營收
**行動**: 
- 提升A類產品庫存水位，確保高週轉
- 縮減C類產品庫存，釋放資金流動性

### 案例 2: 新品成功預測
**情境**: 服飾品牌需要評估新品的市場潛力
**分析方法**: 結合歷史銷售分布和產品屬性分析
**發現**: 
- 上市後30天銷售量可預測90天表現
- 社群討論度與最終銷售成績呈0.7相關性
**行動**: 建立新品評估模型，提早識別爆款產品

### 案例 3: 長尾產品策略
**情境**: 書籍電商發現大量小眾書籍銷售緩慢
**分析方法**: 長尾分布分析和個性化推薦
**發現**: 
- 20%的長尾書籍貢獻35%的獲利
- 個性化推薦可提升長尾產品銷售300%
**行動**: 
- 建立智能推薦系統
- 優化長尾產品的數位行銷策略

## 技術實作重點

### 1. ABC分析演算法
```python
def abc_analysis(products_df):
    # 計算累積貢獻度
    sorted_df = products_df.sort_values('revenue', ascending=False)
    sorted_df['cumulative_revenue'] = sorted_df['revenue'].cumsum()
    sorted_df['cumulative_percent'] = sorted_df['cumulative_revenue'] / sorted_df['revenue'].sum()
    
    # ABC分類
    sorted_df['abc_category'] = 'C'
    sorted_df.loc[sorted_df['cumulative_percent'] <= 0.8, 'abc_category'] = 'A'
    sorted_df.loc[(sorted_df['cumulative_percent'] > 0.8) & (sorted_df['cumulative_percent'] <= 0.95), 'abc_category'] = 'B'
    
    return sorted_df
```

### 2. 產品生命週期檢測
```python
def detect_lifecycle_stage(sales_history):
    # 銷售趨勢分析
    trend = calculate_trend(sales_history)
    volatility = calculate_volatility(sales_history)
    days_since_launch = len(sales_history)
    
    if days_since_launch < 30:
        return 'introduction'
    elif trend > 0.1 and volatility < 0.3:
        return 'growth'
    elif abs(trend) < 0.05:
        return 'maturity'
    elif trend < -0.1:
        return 'decline'
    else:
        return 'unknown'
```

### 3. 庫存最佳化
```python
def calculate_eoq(annual_demand, order_cost, holding_cost):
    # 經濟訂購量公式
    eoq = math.sqrt((2 * annual_demand * order_cost) / holding_cost)
    return eoq

def calculate_safety_stock(lead_time, demand_std, service_level):
    # 安全庫存計算
    z_score = norm.ppf(service_level)
    safety_stock = z_score * demand_std * math.sqrt(lead_time)
    return safety_stock
```

## 進階挑戰

### 挑戰 1: 動態ABC分類
建立能夠根據市場變化自動調整ABC閾值的智能系統

### 挑戰 2: 多維度產品分析
整合銷售、利潤、庫存、客戶滿意度的綜合產品評分

### 挑戰 3: 預測性庫存管理
建立基於機器學習的需求預測和動態庫存優化

### 挑戰 4: 產品組合最佳化
使用線性規劃找出最佳的產品組合策略

## 學習資源

### 推薦工具
- **分析工具**: Python/Pandas, R
- **視覺化**: ECharts, Plotly, D3.js
- **統計分析**: SciPy, NumPy
- **最佳化**: PuLP, scipy.optimize

### 延伸閱讀
- 《庫存管理與控制》- 供應鏈最佳化策略
- 《ABC分析實務》- 產品分類與管理方法
- 《產品生命週期管理》- 從設計到下市的完整流程
- 《數據驅動的產品策略》- 現代產品管理方法論

## 數學模型

### 帕累托分布
```
P(X > x) = (x_m/x)^α
其中 x_m 是最小值，α 是形狀參數
```

### 經濟訂購量 (EOQ)
```
EOQ = √(2DS/H)
其中 D = 年需求量，S = 訂購成本，H = 持有成本
```

### 安全庫存
```
SS = Z × σ_LT × √L
其中 Z = 服務水準對應的Z值，σ_LT = 前置時間需求標準差，L = 前置時間
```

## 實務應用

### 零售業應用
- 商品組合最佳化
- 季節性庫存管理
- 促銷效果評估

### 製造業應用  
- 原物料ABC分類
- 生產排程最佳化
- 供應商評估

### 電商應用
- 長尾商品策略
- 個性化推薦
- 動態定價模型

---

**下一步**: 完成此模組後，將進入第二階段「高級分析技術」，開始學習 MODULE 05: 客戶分群實驗室，探索更高級的機器學習技術。