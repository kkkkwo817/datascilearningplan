# 教程 05: 客戶分群與機器學習實戰指南

## 📚 學習目標

本教程將帶你深入了解客戶分群分析的實務操作，從機器學習基礎到策略落地，讓你能夠：

- 掌握多種聚類算法的原理和實際應用
- 理解特徵工程在客戶分群中的關鍵作用
- 學會評估聚類效果和選擇最佳參數
- 建立客戶群組標籤和差異化行銷策略
- 實現ROI預估和營銷效果預測

## 🎯 為什麼要進行客戶分群？

### 商業價值
- **精準行銷**: 針對不同客戶群組制定差異化策略，提升轉換率
- **資源優化**: 合理分配行銷預算，提高投資回報率
- **客戶留存**: 識別高價值客戶並制定維護策略
- **風險控制**: 早期識別流失風險，制定挽回方案

### 實際案例
一家零售連鎖企業通過客戶分群分析發現：
- 15%的客戶貢獻了70%的營收
- 實施分群行銷後，轉換率提升180%
- 客戶流失率降低40%，年度節省成本300萬元
- 平均訂單價值提升25%，整體營收增長35%

## 🔍 客戶分群分析框架

### 1. 數據準備階段
```
特徵收集 → 數據清理 → 特徵工程 → 數據標準化
```

### 2. 模型建立階段
```
算法選擇 → 參數調優 → 聚類執行 → 效果評估
```

### 3. 業務應用階段
```
群組解釋 → 標籤生成 → 策略制定 → ROI預估
```

## 📊 機器學習聚類算法詳解

### K-Means 聚類算法

#### 理論基礎

K-Means是最常用的聚類算法，基於距離的相似性進行分群：
> 將數據分為k個群組，使得群內數據點盡可能相似，群間數據點盡可能不同

#### 算法步驟

1. **初始化**: 隨機選擇k個聚類中心
2. **分配**: 將每個數據點分配到最近的聚類中心
3. **更新**: 重新計算每個群組的中心點
4. **重複**: 重複步驟2-3直到收斂

**實作程式碼**:
```python
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

def perform_kmeans_clustering(customer_data, k=4):
    # 數據標準化
    scaler = StandardScaler()
    scaled_data = scaler.fit_transform(customer_data)
    
    # 執行K-Means
    kmeans = KMeans(n_clusters=k, random_state=42)
    cluster_labels = kmeans.fit_predict(scaled_data)
    
    return cluster_labels, kmeans.cluster_centers_
```

**優缺點分析**:

| 優點 | 缺點 |
|------|------|
| 算法簡單，計算效率高 | 需要預先指定群數k |
| 適合球形分布的數據 | 對異常值敏感 |
| 結果容易解釋 | 假設群組大小相似 |

### 階層聚類算法

#### 理論基礎

階層聚類通過逐步合併相似的群組來建立聚類樹：
> 不需要預先指定群數，可以通過樹狀圖選擇最佳分群層級

#### 連結方法比較

**Ward連結** (推薦使用):
```python
from sklearn.cluster import AgglomerativeClustering

def perform_hierarchical_clustering(customer_data, n_clusters=4):
    hierarchical = AgglomerativeClustering(
        n_clusters=n_clusters, 
        linkage='ward'
    )
    cluster_labels = hierarchical.fit_predict(customer_data)
    return cluster_labels
```

| 連結方法 | 特點 | 適用場景 |
|----------|------|----------|
| Ward | 最小化群內方差，產生緊密群組 | 客戶分群、產品分類 |
| Complete | 最大距離連結，產生球形群組 | 品質控制、風險管理 |
| Average | 平均距離連結，平衡效果 | 一般分群分析 |
| Single | 最小距離連結，易產生鏈狀 | 網路分析、地理分布 |

### DBSCAN 密度聚類

#### 理論基礎

DBSCAN基於密度的聚類方法，能夠自動確定群數並處理噪聲：
> 將密度相近的數據點歸為一群，同時識別噪聲點

#### 核心參數

**eps (鄰域半徑)**:
- 定義點的鄰域範圍
- 較小值產生更多小群組
- 較大值合併更多數據點

**min_samples (最小樣本數)**:
- 形成核心點的最小鄰居數
- 經驗法則：2×特徵維度

**實作程式碼**:
```python
from sklearn.cluster import DBSCAN

def perform_dbscan_clustering(customer_data, eps=0.5, min_samples=5):
    dbscan = DBSCAN(eps=eps, min_samples=min_samples)
    cluster_labels = dbscan.fit_predict(customer_data)
    
    # 分析結果
    n_clusters = len(set(cluster_labels)) - (1 if -1 in cluster_labels else 0)
    n_noise = list(cluster_labels).count(-1)
    
    return cluster_labels, n_clusters, n_noise
```

## 🛠️ 特徵工程實戰指南

### 1. RFM特徵擴展

#### 基礎RFM計算
```sql
-- 擴展RFM特徵計算
WITH customer_metrics AS (
    SELECT 
        customer_id,
        -- 基礎RFM
        DATEDIFF(CURRENT_DATE, MAX(order_date)) as recency_days,
        COUNT(DISTINCT order_id) as frequency_90d,
        SUM(order_amount) as monetary_90d,
        
        -- 擴展特徵
        AVG(order_amount) as avg_order_value,
        STDDEV(order_amount) as order_amount_std,
        COUNT(DISTINCT product_category) as category_diversity,
        
        -- 時間特徵
        DATEDIFF(MAX(order_date), MIN(order_date)) as customer_lifespan,
        COUNT(DISTINCT DATE_FORMAT(order_date, '%Y-%m')) as active_months,
        
        -- 行為特徵
        SUM(CASE WHEN order_channel = 'mobile' THEN 1 ELSE 0 END) / COUNT(*) as mobile_ratio,
        SUM(CASE WHEN discount_amount > 0 THEN 1 ELSE 0 END) / COUNT(*) as discount_usage_ratio
        
    FROM orders o
    WHERE order_date >= DATE_SUB(CURRENT_DATE, INTERVAL 12 MONTH)
    GROUP BY customer_id
)
SELECT 
    customer_id,
    recency_days,
    frequency_90d,
    monetary_90d,
    avg_order_value,
    category_diversity,
    customer_lifespan,
    mobile_ratio,
    discount_usage_ratio,
    
    -- 客戶價值指標
    (monetary_90d / NULLIF(customer_lifespan, 0)) * 365 as annual_value,
    (frequency_90d / NULLIF(active_months, 0)) as monthly_frequency,
    
    -- 穩定性指標
    CASE 
        WHEN order_amount_std / NULLIF(avg_order_value, 0) < 0.3 THEN 'Stable'
        WHEN order_amount_std / NULLIF(avg_order_value, 0) < 0.7 THEN 'Variable'
        ELSE 'Volatile'
    END as spending_pattern
    
FROM customer_metrics;
```

### 2. 主成分分析 (PCA)

PCA用於降維和特徵選擇，幫助：
- 減少特徵維度
- 去除特徵間的相關性
- 保留最重要的信息
- 視覺化高維數據

```python
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler

def perform_pca_analysis(customer_features, n_components=2):
    """
    執行主成分分析
    """
    # 數據標準化
    scaler = StandardScaler()
    scaled_features = scaler.fit_transform(customer_features)
    
    # 執行PCA
    pca = PCA(n_components=n_components)
    principal_components = pca.fit_transform(scaled_features)
    
    # 分析結果
    explained_variance_ratio = pca.explained_variance_ratio_
    
    return {
        'principal_components': principal_components,
        'explained_variance_ratio': explained_variance_ratio,
        'pca_model': pca
    }
```

## 📈 聚類效果評估

### 1. 輪廓係數 (Silhouette Score)

輪廓係數衡量每個數據點與其所在群組的相似度，範圍在-1到1之間：
- 接近1：數據點與其群組很相似，與其他群組很不同
- 接近0：數據點在兩個群組的邊界上
- 接近-1：數據點可能被分配到錯誤的群組

### 2. Davies-Bouldin指數

Davies-Bouldin指數評估群組間的分離度和群組內的緊密度，值越小表示聚類效果越好。

### 3. 肘部法則 (Elbow Method)

通過觀察SSE隨K值變化的曲線，找出"肘部"點作為最佳K值。

## 🏷️ 客戶群組標籤與策略制定

### 群組標籤生成

基於聚類結果，自動生成業務友好的客戶標籤：

1. **🏆 冠軍客戶**: 高頻高額購買，品牌忠誠度高
2. **💎 忠誠客戶**: 穩定購買，價格敏感度低  
3. **🌟 潛力客戶**: 購買頻率適中，有提升空間
4. **😴 休眠客戶**: 長時間未購買，需要喚醒策略
5. **🆕 新客戶**: 新註冊或首次購買的客戶

### ROI預估系統

為每個客戶群組預估營銷投資回報：

```python
def calculate_roi_projection(segment_info, investment=1000):
    """
    計算群組ROI預估
    """
    conversion_rates = {
        '🏆 冠軍客戶': 0.85,
        '💎 忠誠客戶': 0.65,
        '🌟 潛力客戶': 0.45,
        '🆕 新客戶': 0.35,
        '😴 休眠客戶': 0.15
    }
    
    avg_order_values = {
        '🏆 冠軍客戶': 150,
        '💎 忠誠客戶': 120,
        '🌟 潛力客戶': 80,
        '🆕 新客戶': 70,
        '😴 休眠客戶': 40
    }
    
    segment_label = segment_info['label']
    customer_count = segment_info['count']
    
    conversion_rate = conversion_rates.get(segment_label, 0.2)
    avg_order_value = avg_order_values.get(segment_label, 60)
    
    projected_customers = customer_count * conversion_rate
    projected_revenue = projected_customers * avg_order_value
    roi = ((projected_revenue - investment) / investment) * 100
    
    return {
        'projected_revenue': projected_revenue,
        'roi': roi,
        'conversion_rate': conversion_rate * 100
    }
```

## 📊 實戰案例分析

### 電商平台客戶分群案例

某電商平台通過客戶分群分析：

1. **數據準備**: 收集12個月的交易數據、行為數據、用戶畫像
2. **特徵工程**: 構建RFM特徵、行為特徵、偏好特徵
3. **模型建立**: 比較K-Means、階層聚類、DBSCAN效果
4. **群組分析**: 識別出5個主要客戶群組
5. **策略制定**: 為每個群組制定差異化營銷策略

**實施結果**:
- 整體營收增長28%
- 客戶流失率降低35%
- 營銷ROI從85%提升至135%
- 客戶滿意度從7.2分提升至8.6分

## 🚀 實踐建議

### 1. 實施路線圖

- **第1-2週**: 數據收集和品質評估
- **第3-4週**: 特徵工程和預處理
- **第5-6週**: 模型建立和參數調優
- **第7-8週**: 業務應用和策略制定
- **第9-12週**: 效果驗證和持續優化

### 2. 常見挑戰

#### 數據品質問題
- 建立數據品質檢查機制
- 處理缺失值和異常值
- 確保數據一致性和準確性

#### 特徵選擇困難
- 使用特徵重要性分析
- 進行相關性分析
- 結合業務知識選擇特徵

#### 模型解釋困難
- 生成群組特徵報告
- 使用自然語言描述
- 提供可視化分析結果

### 3. 持續優化

- 定期監控模型性能
- 檢測數據漂移和概念漂移
- 根據業務反饋調整策略
- 建立A/B測試驗證機制
  FROM orders
  WHERE order_date >= CURRENT_DATE - INTERVAL '90' DAY
  GROUP BY customer_id
)
SELECT customer_id,
       DATEDIFF('day', last_date, CURRENT_DATE) AS recency_days,
       frequency_90d,
       monetary_90d
FROM orders_90d;
```

## 2. 特徵縮放與降維（可選）
- StandardScaler/MinMaxScaler
- PCA/UMAP 僅用於視覺化，不必作為訓練必要步驟

## 3. 聚類建模
```python
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans, AgglomerativeClustering, DBSCAN
from sklearn.metrics import silhouette_score, davies_bouldin_score

X = df[features].values
X = StandardScaler().fit_transform(X)

# KMeans
scores = []
for k in range(2, 11):
    km = KMeans(n_clusters=k, random_state=42, n_init='auto').fit(X)
    labels = km.labels_
    sil = silhouette_score(X, labels)
    dbi = davies_bouldin_score(X, labels)
    scores.append((k, sil, dbi))

best_k = max(scores, key=lambda x: x[1])[0]
km = KMeans(n_clusters=best_k, random_state=42, n_init='auto').fit(X)
labels = km.labels_
```

## 4. 分群品質與命名
- 以 Silhouette、DBI 與業務可解釋性綜合決策
- 群組命名規則：高價值忠誠、潛力新客、價格敏感、沉睡喚醒…

```python
import pandas as pd

df['cluster'] = labels
profile = df.groupby('cluster')[features].mean()
# 依據特徵強弱、占比與價值指標生成群組標籤
```

## 5. 視覺化建議（ECharts）
- 2D/3D 散點（PCA/UMAP）
- 雷達圖：群組中心特徵
- 環圖：群組占比
- 箱形圖：群內分佈差異

## 6. 策略落地
- 針對每群：促活/召回、推薦、加價、交叉銷售
- 建立策略卡片：目標客群、訊息主題、渠道、預期 uplift、KPI

## 7. 驗證與迭代
- A/B 或歷史回溯評估策略效果
- 週期性重跑聚類，追蹤群組漂移

---

- 相關檔案：
  - `docs/data-science-lab/MODULE-05.md`
  - `docs/data-science-lab/modules/module-05-customer-segmentation-lab.md` 