# 教程 03: 客戶行為分析實務指南

## 📚 學習目標

本教程將帶你深入了解客戶行為分析的實務操作，從理論基礎到實際應用，讓你能夠：

- 理解客戶行為分析在商業決策中的重要性
- 掌握RFM分析的完整實施流程
- 學會使用數據驅動的方法進行客戶細分
- 建立客戶價值評估和預測模型

## 🎯 為什麼要進行客戶行為分析？

### 商業價值
- **提升營收**: 精準識別高價值客戶，提供個性化服務
- **降低成本**: 優化行銷資源配置，提高ROI
- **增強黏性**: 了解客戶需求，提升滿意度和忠誠度
- **預防流失**: 提前識別流失風險，制定挽回策略

### 實際案例
一家電商公司通過客戶行為分析發現：
- 20%的客戶貢獻了80%的營收
- 實施差異化服務後，整體客戶滿意度提升25%
- 客戶流失率降低40%，新客戶獲取成本降低30%

## 🔍 客戶行為分析框架

### 1. 數據收集層
```
交易數據 + 行為數據 + 人口統計數據
    ↓
集成客戶360度視圖
```

### 2. 分析處理層
```
RFM分析 → 客戶細分 → 價值評估 → 行為預測
```

### 3. 應用決策層
```
個性化行銷 + 客戶服務優化 + 產品推薦 + 流失預防
```

## 📊 RFM分析深度解析

### 理論基礎

RFM模型基於一個簡單而有效的假設：
> 最近購買的客戶、購買頻率高的客戶、以及消費金額大的客戶，最有可能成為回頭客

### 維度詳解

#### Recency (最近性) - R
**定義**: 客戶最後一次購買距今的時間間隔

**計算方法**:
```sql
SELECT 
    customer_id,
    DATEDIFF(CURRENT_DATE, MAX(order_date)) as recency_days
FROM orders
WHERE order_status = 'completed'
GROUP BY customer_id;
```

**分級標準示例**:
| R值 | 天數範圍 | 客戶狀態 |
|-----|----------|----------|
| 5 | 0-30天 | 非常活躍 |
| 4 | 31-60天 | 活躍 |
| 3 | 61-90天 | 普通 |
| 2 | 91-180天 | 不活躍 |
| 1 | 180天+ | 流失風險 |

#### Frequency (頻率) - F
**定義**: 客戶在特定時間段內的購買次數

**計算方法**:
```sql
SELECT 
    customer_id,
    COUNT(DISTINCT order_id) as frequency_count
FROM orders
WHERE order_date >= DATE_SUB(CURRENT_DATE, INTERVAL 12 MONTH)
    AND order_status = 'completed'
GROUP BY customer_id;
```

**分級標準示例**:
| F值 | 購買次數 | 忠誠度等級 |
|-----|----------|------------|
| 5 | 15次以上 | 超級忠誠 |
| 4 | 10-14次 | 高忠誠 |
| 3 | 6-9次 | 中等忠誠 |
| 2 | 3-5次 | 低忠誠 |
| 1 | 1-2次 | 新客戶/偶爾購買 |

#### Monetary (金額) - M
**定義**: 客戶累計消費的總金額

**計算方法**:
```sql
SELECT 
    customer_id,
    SUM(order_amount) as monetary_value
FROM orders
WHERE order_date >= DATE_SUB(CURRENT_DATE, INTERVAL 12 MONTH)
    AND order_status = 'completed'
GROUP BY customer_id;
```

**分級標準示例**:
| M值 | 消費金額 | 價值等級 |
|-----|----------|----------|
| 5 | 30,000元+ | 非常高價值 |
| 4 | 20,000-29,999元 | 高價值 |
| 3 | 10,000-19,999元 | 中等價值 |
| 2 | 5,000-9,999元 | 低價值 |
| 1 | 5,000元以下 | 很低價值 |

## 🛠️ 實戰操作指南

### 步驟1: 數據準備

#### 建立分析用數據表
```sql
-- 創建客戶行為分析基礎表
CREATE VIEW customer_rfm_base AS
SELECT 
    o.customer_id,
    c.customer_name,
    c.registration_date,
    c.city,
    COUNT(DISTINCT o.order_id) as total_orders,
    SUM(o.order_amount) as total_amount,
    AVG(o.order_amount) as avg_order_value,
    MIN(o.order_date) as first_order_date,
    MAX(o.order_date) as last_order_date,
    DATEDIFF(CURRENT_DATE, MAX(o.order_date)) as recency_days
FROM orders o
JOIN customers c ON o.customer_id = c.customer_id
WHERE o.order_status = 'completed'
    AND o.order_date >= DATE_SUB(CURRENT_DATE, INTERVAL 24 MONTH)
GROUP BY o.customer_id, c.customer_name, c.registration_date, c.city;
```

#### 數據品質檢查
```sql
-- 檢查數據完整性
SELECT 
    COUNT(*) as total_customers,
    COUNT(CASE WHEN total_orders IS NULL THEN 1 END) as missing_orders,
    COUNT(CASE WHEN total_amount IS NULL THEN 1 END) as missing_amount,
    COUNT(CASE WHEN last_order_date IS NULL THEN 1 END) as missing_dates,
    MIN(total_amount) as min_amount,
    MAX(total_amount) as max_amount,
    AVG(total_amount) as avg_amount
FROM customer_rfm_base;
```

### 步驟2: RFM分數計算

#### 使用分位數方法
```sql
-- 計算分位數閾值
WITH rfm_quartiles AS (
    SELECT 
        PERCENTILE_CONT(0.8) WITHIN GROUP (ORDER BY recency_days DESC) as r_80,
        PERCENTILE_CONT(0.6) WITHIN GROUP (ORDER BY recency_days DESC) as r_60,
        PERCENTILE_CONT(0.4) WITHIN GROUP (ORDER BY recency_days DESC) as r_40,
        PERCENTILE_CONT(0.2) WITHIN GROUP (ORDER BY recency_days DESC) as r_20,
        
        PERCENTILE_CONT(0.2) WITHIN GROUP (ORDER BY total_orders) as f_20,
        PERCENTILE_CONT(0.4) WITHIN GROUP (ORDER BY total_orders) as f_40,
        PERCENTILE_CONT(0.6) WITHIN GROUP (ORDER BY total_orders) as f_60,
        PERCENTILE_CONT(0.8) WITHIN GROUP (ORDER BY total_orders) as f_80,
        
        PERCENTILE_CONT(0.2) WITHIN GROUP (ORDER BY total_amount) as m_20,
        PERCENTILE_CONT(0.4) WITHIN GROUP (ORDER BY total_amount) as m_40,
        PERCENTILE_CONT(0.6) WITHIN GROUP (ORDER BY total_amount) as m_60,
        PERCENTILE_CONT(0.8) WITHIN GROUP (ORDER BY total_amount) as m_80
    FROM customer_rfm_base
)
SELECT 
    b.*,
    -- R分數計算 (天數越少分數越高)
    CASE 
        WHEN b.recency_days <= q.r_20 THEN 5
        WHEN b.recency_days <= q.r_40 THEN 4
        WHEN b.recency_days <= q.r_60 THEN 3
        WHEN b.recency_days <= q.r_80 THEN 2
        ELSE 1
    END as r_score,
    
    -- F分數計算 (次數越多分數越高)
    CASE 
        WHEN b.total_orders >= q.f_80 THEN 5
        WHEN b.total_orders >= q.f_60 THEN 4
        WHEN b.total_orders >= q.f_40 THEN 3
        WHEN b.total_orders >= q.f_20 THEN 2
        ELSE 1
    END as f_score,
    
    -- M分數計算 (金額越高分數越高)
    CASE 
        WHEN b.total_amount >= q.m_80 THEN 5
        WHEN b.total_amount >= q.m_60 THEN 4
        WHEN b.total_amount >= q.m_40 THEN 3
        WHEN b.total_amount >= q.m_20 THEN 2
        ELSE 1
    END as m_score
FROM customer_rfm_base b
CROSS JOIN rfm_quartiles q;
```

### 步驟3: 客戶細分

#### 基於RFM分數的細分邏輯
```sql
-- 生成最終的客戶細分結果
WITH rfm_scores AS (
    -- 前面的RFM分數計算邏輯
    ...
),
customer_segments AS (
    SELECT 
        *,
        CONCAT(r_score, f_score, m_score) as rfm_string,
        r_score + f_score + m_score as rfm_total,
        
        -- 客戶細分邏輯
        CASE 
            WHEN r_score >= 4 AND f_score >= 4 AND m_score >= 4 THEN '冠軍客戶'
            WHEN r_score >= 3 AND f_score >= 3 AND m_score >= 3 THEN '忠誠客戶'
            WHEN r_score >= 4 AND f_score <= 2 THEN '新客戶'
            WHEN r_score <= 2 AND f_score >= 3 AND m_score >= 3 THEN '流失風險客戶'
            WHEN r_score >= 3 AND f_score >= 2 AND m_score >= 2 THEN '潛力客戶'
            ELSE '其他客戶'
        END as customer_segment
    FROM rfm_scores
)
SELECT 
    customer_segment,
    COUNT(*) as customer_count,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) as percentage,
    AVG(total_amount) as avg_monetary,
    AVG(total_orders) as avg_frequency,
    AVG(recency_days) as avg_recency
FROM customer_segments
GROUP BY customer_segment
ORDER BY avg_monetary DESC;
```

### 步驟4: 客戶價值分析

#### 客戶生命週期價值(CLV)計算
```sql
-- CLV簡化計算模型
WITH customer_clv AS (
    SELECT 
        customer_id,
        customer_name,
        customer_segment,
        total_amount,
        total_orders,
        
        -- 平均訂單價值
        total_amount / total_orders as avg_order_value,
        
        -- 購買頻率 (月)
        total_orders / GREATEST(MONTHS_BETWEEN(last_order_date, first_order_date), 1) as monthly_frequency,
        
        -- 客戶年齡 (月)
        MONTHS_BETWEEN(CURRENT_DATE, registration_date) as customer_age_months,
        
        -- 簡化CLV計算 (假設客戶生命週期24個月，毛利率25%)
        (total_amount / total_orders) * 
        (total_orders / GREATEST(MONTHS_BETWEEN(last_order_date, first_order_date), 1)) * 
        24 * 0.25 as estimated_clv
        
    FROM customer_segments
)
SELECT 
    customer_segment,
    COUNT(*) as customer_count,
    AVG(estimated_clv) as avg_clv,
    SUM(estimated_clv) as total_clv,
    ROUND(SUM(estimated_clv) * 100.0 / SUM(SUM(estimated_clv)) OVER(), 2) as clv_contribution_pct
FROM customer_clv
GROUP BY customer_segment
ORDER BY avg_clv DESC;
```

## 📈 進階分析技術

### 1. 動態RFM分析

考慮時間因素的RFM分析，追蹤客戶價值變化趨勢。

```python
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

def dynamic_rfm_analysis(df, analysis_periods=6):
    """
    執行動態RFM分析
    
    Parameters:
    df: 包含customer_id, order_date, order_amount的DataFrame
    analysis_periods: 分析的時間期間數量
    
    Returns:
    DataFrame: 各期間的RFM分析結果
    """
    results = []
    end_date = df['order_date'].max()
    
    for period in range(analysis_periods):
        # 計算當期的結束日期
        period_end = end_date - timedelta(days=30 * period)
        period_start = period_end - timedelta(days=365)  # 過去12個月
        
        # 篩選時間範圍內的數據
        period_data = df[
            (df['order_date'] >= period_start) & 
            (df['order_date'] <= period_end)
        ]
        
        # 計算RFM指標
        rfm = period_data.groupby('customer_id').agg({
            'order_date': ['max', 'count'],
            'order_amount': 'sum'
        }).round(2)
        
        rfm.columns = ['last_order_date', 'frequency', 'monetary']
        rfm['recency'] = (period_end - rfm['last_order_date']).dt.days
        
        # 計算RFM分數
        rfm['r_score'] = pd.qcut(rfm['recency'].rank(method='first'), 5, labels=[5,4,3,2,1])
        rfm['f_score'] = pd.qcut(rfm['frequency'].rank(method='first'), 5, labels=[1,2,3,4,5])
        rfm['m_score'] = pd.qcut(rfm['monetary'].rank(method='first'), 5, labels=[1,2,3,4,5])
        
        rfm['period'] = period
        rfm['analysis_date'] = period_end
        
        results.append(rfm)
    
    return pd.concat(results)
```

### 2. 客戶細分的穩定性分析

分析客戶在不同時期間的細分變化，識別細分穩定性。

```python
def segment_transition_analysis(dynamic_rfm_df):
    """
    分析客戶細分轉換矩陣
    """
    # 為每個客戶在每個期間分配細分標籤
    dynamic_rfm_df['segment'] = dynamic_rfm_df.apply(assign_segment, axis=1)
    
    # 計算轉換矩陣
    pivot_data = dynamic_rfm_df.pivot_table(
        index='customer_id', 
        columns='period', 
        values='segment', 
        aggfunc='first'
    )
    
    # 計算期間0到期間1的轉換
    transition_df = pivot_data[[0, 1]].dropna()
    transition_matrix = pd.crosstab(
        transition_df[0], 
        transition_df[1], 
        normalize='index'
    )
    
    return transition_matrix

def assign_segment(row):
    """根據RFM分數分配客戶細分"""
    r, f, m = int(row['r_score']), int(row['f_score']), int(row['m_score'])
    
    if r >= 4 and f >= 4 and m >= 4:
        return '冠軍客戶'
    elif r >= 3 and f >= 3 and m >= 3:
        return '忠誠客戶'
    elif r >= 4 and f <= 2:
        return '新客戶'
    elif r <= 2 and f >= 3:
        return '流失風險客戶'
    else:
        return '潛力客戶'
```

### 3. 預測性客戶分析

使用機器學習預測客戶未來行為。

```python
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

def predict_customer_churn(customer_features):
    """
    預測客戶流失
    
    Parameters:
    customer_features: 包含客戶特徵的DataFrame
    - recency, frequency, monetary
    - avg_order_value, customer_age_days
    - last_order_days_ago
    """
    
    # 定義流失標準 (例如：90天未購買)
    customer_features['is_churned'] = (customer_features['recency'] > 90).astype(int)
    
    # 特徵選擇
    feature_columns = [
        'frequency', 'monetary', 'avg_order_value', 
        'customer_age_days', 'r_score', 'f_score', 'm_score'
    ]
    
    X = customer_features[feature_columns]
    y = customer_features['is_churned']
    
    # 訓練測試分割
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.3, random_state=42, stratify=y
    )
    
    # 訓練隨機森林模型
    rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
    rf_model.fit(X_train, y_train)
    
    # 預測和評估
    y_pred = rf_model.predict(X_test)
    y_pred_proba = rf_model.predict_proba(X_test)[:, 1]
    
    # 特徵重要性
    feature_importance = pd.DataFrame({
        'feature': feature_columns,
        'importance': rf_model.feature_importances_
    }).sort_values('importance', ascending=False)
    
    return {
        'model': rf_model,
        'predictions': y_pred,
        'probabilities': y_pred_proba,
        'feature_importance': feature_importance,
        'classification_report': classification_report(y_test, y_pred)
    }
```

## 🎯 業務應用策略

### 針對不同客戶群體的策略

#### 1. 冠軍客戶 (Champions)
**特徵**: R=4-5, F=4-5, M=4-5
**策略**:
```
- VIP專屬服務通道
- 早期新品體驗機會
- 個人專屬客戶經理
- 生日及紀念日特別禮品
- 忠誠度積分加倍計劃
```

**實施方案**:
```sql
-- 識別冠軍客戶並制定行動清單
SELECT 
    customer_id,
    customer_name,
    total_amount,
    last_order_date,
    '設置VIP標籤' as action_1,
    '分配專屬客戶經理' as action_2,
    '邀請參加VIP活動' as action_3
FROM customer_segments 
WHERE customer_segment = '冠軍客戶'
ORDER BY total_amount DESC;
```

#### 2. 忠誠客戶 (Loyal Customers)
**特徵**: R=3-4, F=3-4, M=3-4
**策略**:
```
- 會員等級升級計劃
- 個性化產品推薦
- 限時專屬優惠
- 推薦好友獎勵計劃
```

#### 3. 潛力客戶 (Potential Loyalists)
**特徵**: R=3-4, F=2-3, M=2-3
**策略**:
```
- 免費升級服務體驗
- 交叉銷售推薦
- 使用教學和培訓
- 定期關懷和跟進
```

#### 4. 新客戶 (New Customers)
**特徵**: R=4-5, F=1-2, M=1-2
**策略**:
```
- 新手專屬優惠包
- 產品使用指南
- 客服主動聯繫
- 首購體驗調查
```

#### 5. 流失風險客戶 (At Risk)
**特徵**: R=1-2, F=3-4, M=3-4
**策略**:
```
- 挽回專屬優惠券
- 問卷調查了解原因
- 重新激活活動
- 客服主動致電關懷
```

### 個性化行銷自動化

#### 電子郵件行銷自動化
```python
def create_email_campaign_rules():
    """
    基於客戶細分創建電子郵件行銷規則
    """
    campaign_rules = {
        '冠軍客戶': {
            'frequency': 'weekly',
            'content_type': 'premium_products',
            'discount_range': '0-5%',
            'priority': 'high'
        },
        '忠誠客戶': {
            'frequency': 'bi-weekly', 
            'content_type': 'personalized_recommendations',
            'discount_range': '5-10%',
            'priority': 'high'
        },
        '潛力客戶': {
            'frequency': 'weekly',
            'content_type': 'education_and_promotion',
            'discount_range': '10-15%',
            'priority': 'medium'
        },
        '新客戶': {
            'frequency': 'every_3_days',
            'content_type': 'onboarding_sequence',
            'discount_range': '15-20%',
            'priority': 'medium'
        },
        '流失風險客戶': {
            'frequency': 'immediate',
            'content_type': 'win_back_offer',
            'discount_range': '20-30%',
            'priority': 'urgent'
        }
    }
    
    return campaign_rules
```

## 📊 成效追蹤與優化

### 關鍵績效指標 (KPIs)

#### 1. 客戶價值指標
- **客戶生命週期價值 (CLV)**: 追蹤不同細分群體的CLV變化
- **平均訂單價值 (AOV)**: 監控客戶消費水平提升
- **客戶貢獻度**: 各細分群體對總營收的貢獻比例

#### 2. 客戶行為指標
- **回購率**: 不同細分群體的重複購買比例
- **客戶留存率**: 各期間的客戶留存情況
- **跨品類購買率**: 客戶購買多樣性指標

#### 3. 行銷效果指標
- **轉化率**: 各細分群體的行銷活動轉化效果
- **ROI**: 針對不同細分的行銷投資回報率
- **客戶獲取成本 (CAC)**: 獲得新客戶的成本

### 持續優化框架

```python
def optimization_framework():
    """
    客戶行為分析持續優化框架
    """
    optimization_steps = {
        '月度回顧': [
            '更新RFM分析結果',
            '檢查客戶細分變化',
            '評估行銷活動效果',
            '識別異常客戶行為'
        ],
        
        '季度優化': [
            '調整RFM分數閾值',
            '優化客戶細分策略',
            '更新個性化推薦算法',
            '改進流失預測模型'
        ],
        
        '年度升級': [
            '引入新的分析維度',
            '整合外部數據源',
            '升級預測性分析模型',
            '建立自動化決策系統'
        ]
    }
    
    return optimization_steps
```

## 🚀 實踐建議

### 1. 實施路線圖

#### 第1週：數據準備
- 建立數據收集和清理流程
- 確保數據品質和完整性
- 建立分析用數據表結構

#### 第2週：基礎RFM分析
- 實施基本RFM分析
- 建立客戶細分模型
- 生成初步分析報告

#### 第3週：策略制定
- 為各客戶群體制定差異化策略
- 設計個性化行銷活動
- 建立客戶價值評估體系

#### 第4週：系統自動化
- 建立自動化分析流程
- 設計客戶價值儀表板
- 實施預警和監控機制

### 2. 常見挑戰與解決方案

#### 挑戰1: 數據品質問題
**解決方案**:
- 建立數據驗證規則
- 實施異常值檢測
- 定期數據品質審核

#### 挑戰2: 細分標準主觀性
**解決方案**:
- 使用統計方法確定閾值
- 進行A/B測試驗證效果
- 建立客觀評估指標

#### 挑戰3: 系統整合困難
**解決方案**:
- 採用API接口整合
- 建立數據中台架構
- 使用標準化數據格式

### 3. 成功要素

#### 技術要素
- 完善的數據基礎設施
- 自動化分析流程
- 即時數據更新機制

#### 業務要素
- 明確的業務目標
- 跨部門協作機制
- 持續優化意識

#### 組織要素
- 數據驅動的企業文化
- 專業的分析團隊
- 決策層的支持

## 📝 總結

客戶行為分析是現代企業不可或缺的核心能力。通過系統性的RFM分析和客戶細分，企業能夠：

1. **精準識別客戶價值**，優化資源配置
2. **制定差異化策略**，提升客戶滿意度
3. **預防客戶流失**，降低獲客成本
4. **驅動業務增長**，提升競爭優勢

成功的關鍵在於建立完善的數據基礎、選擇合適的分析方法、制定可執行的業務策略，並持續優化和改進。

---

**下一步學習**: 進入 [教程04: 產品銷售分布與庫存優化](./04-product-distribution-analytics.md)

**相關模組**: [MODULE-03: 客戶行為分析實驗室](../modules/module-03-customer-behavior-lab.md)