# 技術實現筆記

## 📝 總覽

這份文檔記錄了數據科學學習實驗室開發過程中的技術細節、最佳實踐、常見問題及解決方案。

## 🏗️ 項目架構

### 技術棧詳解

#### 前端框架
```typescript
// Next.js 15 + React 19 + TypeScript
- App Router 架構
- 服務端渲染 (SSR)
- 靜態生成 (SSG)
- API Routes 支援
```

#### UI 組件系統
```typescript
// shadcn/ui + Tailwind CSS
- 完全可自定義的組件庫
- Tailwind 工具類樣式
- CSS 變數主題系統
- 響應式設計支援
```

#### 數據視覺化
```typescript
// ECharts + 自定義組件
- 企業級圖表庫
- 自定義主題系統
- 響應式圖表
- 3D 圖表支援
```

### 文件結構

```
/docs/data-science-lab/
├── 00-Master-Plan.md              # 總體計劃
├── 01-Learning-Roadmap.md         # 學習路線圖
├── 02-Data-Science-Concepts.md    # 概念總覽
├── modules/                       # 模組文檔
│   ├── module-template.md         # 文檔模板
│   └── module-01-kpi-lab.md      # KPI 實驗室
├── tutorial/                      # 教學材料
│   ├── README.md                  # 教程說明
│   └── 01-data-fundamentals.md   # 基礎概念
└── technical-notes.md             # 技術筆記

/components/analytics/
├── kpi-lab.tsx                    # KPI 實驗室組件
├── trend-decomposer.tsx           # 趨勢分解器組件
├── customer-behavior-lab.tsx      # 客戶行為分析實驗室
├── product-distribution-lab.tsx   # 產品銷售分布器
├── analytics-tab.tsx             # 分析標籤
├── overview-cards.tsx             # 概覽卡片
└── ...

/app/analytics/
└── page.tsx                       # 分析頁面主文件
```

## 🔧 開發模式

### 組件開發模式

#### 1. 組件設計原則
```typescript
// 單一職責原則
interface ComponentProps {
  data: DataType[]
  onDataChange: (data: DataType[]) => void
  theme?: 'light' | 'dark'
}

// 可組合設計
const ComplexComponent = () => (
  <div>
    <ControlPanel />
    <DataVisualization />
    <ActionButtons />
  </div>
)
```

#### 2. 狀態管理模式
```typescript
// 本地狀態 (useState)
const [filters, setFilters] = useState(defaultFilters)

// 計算狀態 (useMemo)
const processedData = useMemo(() => 
  processData(rawData, filters), [rawData, filters])

// 副作用 (useEffect)
useEffect(() => {
  if (isRealTime) {
    const interval = setInterval(updateData, 5000)
    return () => clearInterval(interval)
  }
}, [isRealTime])
```

#### 3. 類型定義模式
```typescript
// 數據類型
interface BusinessData {
  date: string
  revenue: number
  profit: number
  orders: number
  customers: number
}

// 組件屬性類型
interface KPICardProps {
  title: string
  value: number
  format: 'currency' | 'percentage'
  change: ChangeData
  sparklineData: number[]
  isAnomalous: boolean
}

// 計算結果類型
interface KPIMetrics {
  totalRevenue: number
  profitMargin: number
  avgOrderValue: number
  customerGrowth: number
  change: ChangeData
  isAnomalous: boolean
}
```

### 數據處理模式

#### 1. 數據生成
```typescript
// 模擬數據生成器
const generateBusinessData = (timeRange: TimeRangeType): BusinessData[] => {
  const days = getDaysFromRange(timeRange)
  const data: BusinessData[] = []
  let baseRevenue = 50000
  
  for (let i = 0; i < days; i++) {
    const dailyGrowth = (Math.random() - 0.4) * 0.1
    const revenue = baseRevenue * (1 + dailyGrowth)
    const orders = Math.floor(revenue / 80)
    const customers = Math.floor(orders * 0.8)
    const profit = revenue * 0.25
    
    data.push({
      date: getDateString(i),
      revenue,
      profit,
      orders,
      customers
    })
    
    baseRevenue = revenue * 0.7 + baseRevenue * 0.3
  }
  
  return data
}
```

#### 2. 數據計算
```typescript
// KPI 計算邏輯
const calculateKPIs = (data: BusinessData[]): KPIMetrics => {
  const currentData = data[data.length - 1]
  const previousData = data[data.length - 2] || currentData
  
  // 營收變化率計算
  const revenueChange = previousData.revenue > 0 ? 
    (currentData.revenue - previousData.revenue) / previousData.revenue : 0
  
  // 客戶增長率計算
  const recentCustomers = data.slice(-7).reduce((sum, d) => sum + d.customers, 0) / 7
  const earlyCustomers = data.slice(0, 7).reduce((sum, d) => sum + d.customers, 0) / 7
  const customerGrowth = earlyCustomers > 0 ? (recentCustomers - earlyCustomers) / earlyCustomers : 0
  
  return {
    totalRevenue: currentData.revenue,
    profitMargin: currentData.revenue > 0 ? currentData.profit / currentData.revenue : 0,
    avgOrderValue: currentData.orders > 0 ? currentData.revenue / currentData.orders : 0,
    customerGrowth,
    change: calculateChange(currentData.revenue, previousData.revenue),
    isAnomalous: detectAnomaly(revenueChange)
  }
}
```

#### 3. 異常檢測
```typescript
// Z-score 異常檢測
const detectAnomalies = (values: number[], threshold: number = 2): boolean[] => {
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length
  const stdDev = Math.sqrt(
    values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length
  )
  
  return values.map(value => {
    const zScore = Math.abs((value - mean) / stdDev)
    return zScore > threshold
  })
}
```

## 📊 視覺化實現

### ECharts 配置模式

#### 1. Sparkline 圖表
```typescript
const sparklineOption = useMemo(() => ({
  grid: { left: 0, right: 0, top: 0, bottom: 0 },
  xAxis: { type: 'category', show: false },
  yAxis: { type: 'value', show: false },
  series: [{
    type: 'line',
    data: sparklineData,
    smooth: true,
    symbol: 'none',
    lineStyle: {
      width: 2,
      color: getTrendColor(trend)
    },
    areaStyle: {
      opacity: 0.1,
      color: getTrendColor(trend)
    }
  }]
}), [sparklineData, trend])
```

#### 2. 響應式圖表
```typescript
// 圖表響應式處理
useEffect(() => {
  const handleResize = () => {
    if (chartRef.current) {
      chartRef.current.getEchartsInstance().resize()
    }
  }
  
  window.addEventListener('resize', handleResize)
  return () => window.removeEventListener('resize', handleResize)
}, [])
```

#### 3. 主題切換
```typescript
// 動態主題配置
const getChartTheme = (isDark: boolean) => ({
  backgroundColor: isDark ? '#1f2937' : '#ffffff',
  textStyle: {
    color: isDark ? '#f9fafb' : '#111827'
  },
  grid: {
    borderColor: isDark ? '#374151' : '#e5e7eb'
  }
})
```

## 🚀 性能優化

### 計算優化

#### 1. Memoization
```typescript
// 大數據計算優化
const expensiveCalculation = useMemo(() => {
  return heavyDataProcessing(largeDataset)
}, [largeDataset])

// 圖表配置優化
const chartOption = useMemo(() => {
  return generateChartConfig(processedData, theme)
}, [processedData, theme])
```

#### 2. 虛擬化
```typescript
// 大列表虛擬化
const VirtualizedList = ({ items }) => {
  const [visibleRange, setVisibleRange] = useState([0, 100])
  
  return (
    <div onScroll={handleScroll}>
      {items.slice(visibleRange[0], visibleRange[1]).map(renderItem)}
    </div>
  )
}
```

#### 3. 防抖處理
```typescript
// 搜尋防抖
const debouncedSearch = useCallback(
  debounce((term: string) => {
    performSearch(term)
  }, 300),
  []
)
```

### 渲染優化

#### 1. 條件渲染
```typescript
// 智能條件渲染
const ExpensiveComponent = ({ shouldRender, data }) => {
  if (!shouldRender || !data?.length) return null
  
  return <ComplexVisualization data={data} />
}
```

#### 2. 懶加載
```typescript
// 組件懶加載
const LazyChart = lazy(() => import('./HeavyChart'))

const ChartContainer = () => (
  <Suspense fallback={<ChartSkeleton />}>
    <LazyChart />
  </Suspense>
)
```

## 🔍 調試技巧

### 開發工具

#### 1. 數據檢查
```typescript
// 開發模式數據日誌
if (process.env.NODE_ENV === 'development') {
  console.log('KPI Calculation:', {
    inputData: data.length,
    result: kpiMetrics,
    timestamp: new Date().toISOString()
  })
}
```

#### 2. 性能監控
```typescript
// 渲染性能監控
useEffect(() => {
  const start = performance.now()
  
  return () => {
    const end = performance.now()
    console.log(`Render time: ${end - start}ms`)
  }
})
```

#### 3. 錯誤邊界
```typescript
// 錯誤捕獲和報告
class DataScienceErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Data Science Module Error:', error, errorInfo)
    // 發送錯誤報告到監控系統
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback />
    }
    return this.props.children
  }
}
```

## 🧪 測試策略

### 單元測試
```typescript
// 數據計算函數測試
describe('calculateKPIs', () => {
  test('should calculate correct return rate', () => {
    const testData = generateTestData()
    const result = calculateKPIs(testData)
    expect(result.returnRate).toBeCloseTo(0.05, 2)
  })
  
  test('should handle empty data gracefully', () => {
    const result = calculateKPIs([])
    expect(result.totalValue).toBe(0)
  })
})
```

### 集成測試
```typescript
// 組件交互測試
test('KPI Lab updates when time range changes', async () => {
  render(<KPILab />)
  
  fireEvent.change(screen.getByRole('combobox'), {
    target: { value: '3M' }
  })
  
  await waitFor(() => {
    expect(screen.getByText(/3個月/)).toBeInTheDocument()
  })
})
```

## 🔧 常見問題與解決方案

### 1. 圖表渲染問題
**問題**: ECharts 圖表不顯示或尺寸錯誤
**解決方案**:
```typescript
// 確保容器有明確的高度
<div style={{ height: '300px' }}>
  <EChartsReact option={chartOption} />
</div>

// 監聽容器大小變化
useEffect(() => {
  const observer = new ResizeObserver(() => {
    chartRef.current?.resize()
  })
  observer.observe(containerRef.current)
  return () => observer.disconnect()
}, [])
```

### 2. 狀態更新延遲
**問題**: 狀態更新不及時，導致 UI 不同步
**解決方案**:
```typescript
// 使用 useCallback 避免不必要的重渲染
const handleDataChange = useCallback((newData) => {
  setData(newData)
  // 立即更新相關計算
  setKpiMetrics(calculateKPIs(newData))
}, [])
```

### 3. 記憶體洩漏
**問題**: 定時器或事件監聽器未正確清理
**解決方案**:
```typescript
useEffect(() => {
  const interval = setInterval(updateData, 5000)
  const listener = (e) => handleResize(e)
  
  window.addEventListener('resize', listener)
  
  return () => {
    clearInterval(interval)
    window.removeEventListener('resize', listener)
  }
}, [])
```

### 4. 類型錯誤
**問題**: TypeScript 類型不匹配
**解決方案**:
```typescript
// 使用類型守衛
const isValidData = (data: unknown): data is PortfolioData[] => {
  return Array.isArray(data) && 
         data.every(item => 
           typeof item.date === 'string' && 
           typeof item.totalValue === 'number'
         )
}

// 安全的數據處理
if (isValidData(rawData)) {
  const metrics = calculateKPIs(rawData)
}
```

## 📋 代碼規範

### 命名約定
```typescript
// 組件命名: PascalCase
const KPILabComponent = () => {}

// 函數命名: camelCase
const calculateMetrics = () => {}

// 常量命名: UPPER_SNAKE_CASE
const DEFAULT_TIME_RANGE = '1M'

// 接口命名: PascalCase + Interface 後綴
interface KPIMetricsInterface {}
```

### 文件組織
```typescript
// 導入順序
import React from 'react'                    // React 相關
import { useState } from 'react'
import { Card } from '@/components/ui/card'   // UI 組件
import { formatCurrency } from '@/lib/utils'  // 工具函數
import type { KPIMetrics } from './types'     // 類型定義
```

### 註釋規範
```typescript
/**
 * 計算商業的核心 KPI 指標
 * @param data - 商業歷史數據
 * @param compareBase - 比較基準類型
 * @returns 計算得出的 KPI 指標
 */
const calculateKPIs = (
  data: BusinessData[], 
  compareBase: CompareBaseType
): KPIMetrics => {
  // 實現邏輯...
}
```

## 🔄 持續改進

### 代碼質量
- 定期代碼審查
- 自動化測試覆蓋
- 性能監控和優化
- 依賴項更新管理

### 用戶體驗
- 載入狀態指示
- 錯誤處理和恢復
- 響應式設計優化
- 可訪問性改進

### 文檔維護
- 保持文檔與代碼同步
- 添加更多實例和教程
- 收集用戶反饋
- 定期更新最佳實踐

## 📊 MODULE 03: 客戶行為分析實驗室 技術詳解

### 核心功能實現

#### 1. RFM 分析模型
```typescript
// RFM 評分計算引擎
const getRFMScore = (recency: number, frequency: number, monetary: number) => {
  // R分數: 最近購買時間評分 (1-5分)
  const rScore = recency <= 30 ? 5 : recency <= 60 ? 4 : recency <= 90 ? 3 : recency <= 180 ? 2 : 1
  
  // F分數: 購買頻率評分 (1-5分)  
  const fScore = frequency >= 15 ? 5 : frequency >= 10 ? 4 : frequency >= 6 ? 3 : frequency >= 3 ? 2 : 1
  
  // M分數: 消費金額評分 (1-5分)
  const mScore = monetary >= 30000 ? 5 : monetary >= 20000 ? 4 : monetary >= 10000 ? 3 : monetary >= 5000 ? 2 : 1
  
  return `${rScore}${fScore}${mScore}` // 例如: "555" 表示最高評分
}
```

#### 2. 客戶細分算法
```typescript
// 基於RFM分數的客戶價值細分
const getCustomerSegment = (recency: number, frequency: number, monetary: number) => {
  const rScore = getRScore(recency)
  const fScore = getFScore(frequency) 
  const mScore = getMScore(monetary)
  const totalScore = rScore + fScore + mScore
  
  // 細分邏輯: 總分15分制
  if (totalScore >= 12) return '冠軍客戶'    // 高價值高活躍
  if (totalScore >= 9) return '忠誠客戶'     // 中高價值穩定
  if (totalScore >= 6) return '潛力客戶'     // 中等價值有潛力
  if (totalScore >= 4) return '新客戶'       // 新進客戶
  return '流失風險客戶'                      // 低活躍需關注
}
```

#### 3. 客戶生命週期價值 (CLV) 計算
```typescript
// CLV 預測模型
const calculateCLV = (customer: CustomerData) => {
  const avgOrderValue = customer.monetary / customer.frequency
  const purchaseFrequency = customer.frequency / 12 // 月均頻率
  const customerLifespan = 24 // 假設24個月生命週期
  const retentionRate = getRetentionRate(customer.recency, customer.frequency)
  
  // CLV = 平均訂單價值 × 購買頻率 × 客戶生命週期 × 留存率
  return avgOrderValue * purchaseFrequency * customerLifespan * retentionRate
}
```

#### 4. 流失風險預測
```typescript
// 基於行為模式的流失風險評估
const getChurnRisk = (recency: number, frequency: number, monetary: number) => {
  // 多因子風險評估
  let riskScore = 0
  
  // 時間因子: 最近購買時間越長風險越高
  if (recency > 180) riskScore += 3
  else if (recency > 90) riskScore += 2
  else if (recency > 60) riskScore += 1
  
  // 頻率因子: 購買頻率越低風險越高
  if (frequency < 2) riskScore += 2
  else if (frequency < 5) riskScore += 1
  
  // 價值因子: 消費金額下降增加風險
  const recentAvgOrder = getRecentAvgOrder(customer)
  const historicalAvgOrder = getHistoricalAvgOrder(customer)
  if (recentAvgOrder < historicalAvgOrder * 0.7) riskScore += 1
  
  // 風險分類
  if (riskScore >= 5) return '高風險'
  if (riskScore >= 3) return '中風險'  
  if (riskScore >= 1) return '低風險'
  return '穩定'
}
```

### 數據處理架構

#### 1. 客戶行為數據模型
```typescript
interface CustomerBehaviorData {
  customerId: string
  name: string
  demographics: {
    age: number
    city: string
    registrationDate: string
  }
  rfmMetrics: {
    recency: number        // 最近購買天數
    frequency: number      // 累計購買次數
    monetary: number       // 累計消費金額
    rfmScore: string       // RFM評分字串
  }
  segmentation: {
    segment: CustomerSegment
    clv: number           // 客戶生命週期價值
    churnRisk: ChurnRisk  // 流失風險等級
  }
  preferences: {
    favoriteCategory: string
    preferredChannel: string
    avgOrderValue: number
    totalOrders: number
  }
}
```

#### 2. 行為趨勢追蹤
```typescript
// 客戶行為趨勢數據生成
const generateBehaviorTrendData = (refreshKey: number) => {
  const months = ['1月', '2月', '3月', '4月', '5月', '6月']
  
  return months.map((month, index) => ({
    month,
    activeUsers: generateTrendValue(2000, refreshKey, index, 500, 50),
    newUsers: generateTrendValue(300, refreshKey, index, 100, 5),
    avgSessionTime: generateTrendValue(180, refreshKey, index, 60, 0),
    conversionRate: generateTrendValue(5, refreshKey, index, 2, 0, 2),
    retentionRate: generateTrendValue(75, refreshKey, index, 10, 0, 1)
  }))
}

// 通用趨勢值生成器
const generateTrendValue = (
  base: number, 
  seed: number, 
  index: number, 
  variance: number, 
  growth: number,
  precision: number = 0
) => {
  const trend = base + Math.sin((seed + index) * 0.2) * variance + index * growth
  return precision > 0 ? Number(trend.toFixed(precision)) : Math.round(trend)
}
```

#### 3. 客戶旅程分析
```typescript
// 客戶購買旅程建模
const generateCustomerJourneyData = (refreshKey: number) => {
  const stages = [
    { name: '發現', conversionRate: 0.3 },
    { name: '興趣', conversionRate: 0.4 },
    { name: '考慮', conversionRate: 0.6 },
    { name: '購買', conversionRate: 0.8 },
    { name: '回購', conversionRate: 1.0 }
  ]
  
  let currentUsers = 10000 // 初始用戶數
  
  return stages.map((stage, index) => {
    const variance = Math.sin((refreshKey + index) * 0.1) * 0.1
    const actualConversion = stage.conversionRate + variance
    const nextUsers = Math.round(currentUsers * actualConversion)
    
    const result = {
      stage: stage.name,
      users: currentUsers,
      conversionRate: (actualConversion * 100).toFixed(1)
    }
    
    currentUsers = nextUsers
    return result
  })
}
```

### 視覺化實現

#### 1. 客戶細分餅圖
```typescript
// 動態客戶細分分布圖表
const segmentDistribution = useMemo(() => {
  const segments = ['冠軍客戶', '忠誠客戶', '潛力客戶', '新客戶', '流失風險客戶']
  const colors = ['#10B981', '#3B82F6', '#F59E0B', '#8B5CF6', '#EF4444']
  
  return segments.map((segment, index) => ({
    name: segment,
    value: customerData.filter(c => c.segment === segment).length,
    itemStyle: { color: colors[index] }
  }))
}, [customerData])
```

#### 2. RFM 分布分析圖表
```typescript
// RFM三維度分布視覺化
const RFMDistributionCharts = {
  recencyChart: {
    data: [
      { range: '0-30天', count: customerData.filter(c => c.recency <= 30).length },
      { range: '31-60天', count: customerData.filter(c => c.recency > 30 && c.recency <= 60).length },
      { range: '61-90天', count: customerData.filter(c => c.recency > 60 && c.recency <= 90).length },
      { range: '90天以上', count: customerData.filter(c => c.recency > 90).length }
    ]
  },
  frequencyChart: {
    data: [
      { range: '1-5次', count: customerData.filter(c => c.frequency <= 5).length },
      { range: '6-10次', count: customerData.filter(c => c.frequency > 5 && c.frequency <= 10).length },
      { range: '11-15次', count: customerData.filter(c => c.frequency > 10 && c.frequency <= 15).length },
      { range: '15次以上', count: customerData.filter(c => c.frequency > 15).length }
    ]
  },
  monetaryChart: {
    data: [
      { range: '0-1萬', count: customerData.filter(c => c.monetary <= 10000).length },
      { range: '1-2萬', count: customerData.filter(c => c.monetary > 10000 && c.monetary <= 20000).length },
      { range: '2-3萬', count: customerData.filter(c => c.monetary > 20000 && c.monetary <= 30000).length },
      { range: '3萬以上', count: customerData.filter(c => c.monetary > 30000).length }
    ]
  }
}
```

### 性能優化策略

#### 1. 大數據處理優化
```typescript
// 客戶數據分頁處理
const useCustomerPagination = (customers: CustomerData[], pageSize: number = 50) => {
  const [currentPage, setCurrentPage] = useState(1)
  
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = startIndex + pageSize
    return customers.slice(startIndex, endIndex)
  }, [customers, currentPage, pageSize])
  
  return { paginatedData, currentPage, setCurrentPage }
}
```

#### 2. 計算結果緩存
```typescript
// RFM計算結果緩存
const useRFMCache = () => {
  const cacheRef = useRef(new Map())
  
  const getCachedRFM = useCallback((customerId: string, data: CustomerRawData) => {
    const key = `${customerId}-${data.lastUpdated}`
    
    if (cacheRef.current.has(key)) {
      return cacheRef.current.get(key)
    }
    
    const rfmResult = calculateRFM(data)
    cacheRef.current.set(key, rfmResult)
    return rfmResult
  }, [])
  
  return getCachedRFM
}
```

### 互動功能實現

#### 1. 實時篩選系統
```typescript
// 動態客戶篩選器
const useCustomerFilter = (customers: CustomerData[]) => {
  const [filters, setFilters] = useState({
    segment: 'all',
    riskLevel: 'all',
    clvRange: [0, 100000],
    recencyRange: [0, 365]
  })
  
  const filteredCustomers = useMemo(() => {
    return customers.filter(customer => {
      if (filters.segment !== 'all' && customer.segment !== filters.segment) return false
      if (filters.riskLevel !== 'all' && customer.churnRisk !== filters.riskLevel) return false
      if (customer.clv < filters.clvRange[0] || customer.clv > filters.clvRange[1]) return false
      if (customer.recency < filters.recencyRange[0] || customer.recency > filters.recencyRange[1]) return false
      return true
    })
  }, [customers, filters])
  
  return { filteredCustomers, filters, setFilters }
}
```

#### 2. 客戶詳情展開
```typescript
// 客戶詳細信息展開組件
const CustomerDetailExpansion = ({ customer }: { customer: CustomerData }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  
  return (
    <tr>
      <td colSpan={6}>
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">
              {isExpanded ? <ChevronUp /> : <ChevronDown />}
              查看詳情
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CustomerDetailView customer={customer} />
          </CollapsibleContent>
        </Collapsible>
      </td>
    </tr>
  )
}
```

### 業務智能分析

#### 1. 客戶價值貢獻分析
```typescript
// 帕累托分析 (80/20法則)
const analyzeParetoDistribution = (customers: CustomerData[]) => {
  const sortedByValue = customers.sort((a, b) => b.clv - a.clv)
  const totalValue = sortedByValue.reduce((sum, c) => sum + c.clv, 0)
  
  let cumulativeValue = 0
  let cumulativeCount = 0
  
  const paretoData = sortedByValue.map(customer => {
    cumulativeValue += customer.clv
    cumulativeCount += 1
    
    return {
      customerRank: cumulativeCount,
      cumulativeValuePercent: (cumulativeValue / totalValue) * 100,
      cumulativeCountPercent: (cumulativeCount / customers.length) * 100
    }
  })
  
  // 找出貢獻80%價值的客戶比例
  const pareto80Index = paretoData.findIndex(d => d.cumulativeValuePercent >= 80)
  const pareto80Percent = paretoData[pareto80Index]?.cumulativeCountPercent || 20
  
  return { paretoData, pareto80Percent }
}
```

#### 2. 客戶留存分析
```typescript
// 同期群留存分析
const calculateCohortRetention = (customers: CustomerData[]) => {
  const cohorts = groupBy(customers, c => getRegistrationMonth(c.registrationDate))
  
  return Object.entries(cohorts).map(([cohortMonth, cohortCustomers]) => {
    const retentionByMonth = Array.from({ length: 12 }, (_, monthIndex) => {
      const activeCustomers = cohortCustomers.filter(c => 
        hasActivityInMonth(c, cohortMonth, monthIndex)
      )
      return {
        month: monthIndex,
        retentionRate: (activeCustomers.length / cohortCustomers.length) * 100,
        activeCustomers: activeCustomers.length,
        totalCohortSize: cohortCustomers.length
      }
    })
    
    return {
      cohortMonth,
      cohortSize: cohortCustomers.length,
      retentionByMonth
    }
  })
}
```

## 📦 MODULE 04: 產品銷售分布器 技術詳解

### 核心功能實現

#### 1. ABC分析算法
```typescript
// ABC分析核心算法
const performABCAnalysis = (products: ProductData[]): ProductData[] => {
  // 按收入排序
  const sortedProducts = [...products].sort((a, b) => b.revenue - a.revenue)
  
  // 計算累積收入和分類
  const totalRevenue = sortedProducts.reduce((sum, p) => sum + p.revenue, 0)
  let cumulativeRevenue = 0
  
  return sortedProducts.map(product => {
    cumulativeRevenue += product.revenue
    const cumulativePercent = cumulativeRevenue / totalRevenue
    
    // ABC分類邏輯
    let abcCategory: 'A' | 'B' | 'C'
    if (cumulativePercent <= 0.8) {
      abcCategory = 'A'        // 前80%收入的產品
    } else if (cumulativePercent <= 0.95) {
      abcCategory = 'B'        // 80%-95%收入的產品  
    } else {
      abcCategory = 'C'        // 後5%收入的產品
    }
    
    return { ...product, abcCategory }
  })
}
```

#### 2. 經濟訂購量 (EOQ) 計算
```typescript
// EOQ模型實作
const calculateEOQ = (annualDemand: number, orderCost: number, unitPrice: number, holdingCostRate: number) => {
  // EOQ = √(2DS/H)
  // D = 年需求量, S = 訂購成本, H = 持有成本
  const holdingCost = unitPrice * holdingCostRate
  const eoq = Math.sqrt((2 * annualDemand * orderCost) / holdingCost)
  return Math.round(eoq)
}

// 安全庫存計算
const calculateSafetyStock = (demandStd: number, leadTime: number, serviceLevel: number) => {
  // 根據服務水準確定Z值
  const zScores = {
    0.90: 1.28,
    0.95: 1.65,
    0.99: 2.33
  }
  
  const zScore = zScores[serviceLevel] || 1.65
  const safetyStock = zScore * demandStd * Math.sqrt(leadTime / 30)
  return Math.round(safetyStock)
}
```

#### 3. 產品生命週期判斷
```typescript
// 生命週期階段自動識別
const getLifecycleStage = (daysSinceLaunch: number, turnoverRate: number): string => {
  // 多因子判斷邏輯
  if (daysSinceLaunch < 90) {
    return '導入期'           // 新品階段
  }
  
  if (daysSinceLaunch < 365 && turnoverRate > 8) {
    return '成長期'           // 快速成長階段
  }
  
  if (turnoverRate > 4) {
    return '成熟期'           // 穩定銷售階段
  }
  
  return '衰退期'             // 銷售下滑階段
}
```

#### 4. 缺貨風險評估
```typescript
// 多維度風險評估模型
const getStockoutRisk = (inventory: number, reorderPoint: number, turnoverRate: number): 'Low' | 'Medium' | 'High' => {
  // 風險評分計算
  const inventoryRatio = inventory / reorderPoint
  const turnoverFactor = turnoverRate / 5  // 標準化週轉率
  
  // 綜合風險評分
  const riskScore = (1 / inventoryRatio) * turnoverFactor
  
  if (riskScore > 2) return 'High'
  if (riskScore > 1) return 'Medium'
  return 'Low'
}
```

### 數據模型架構

#### 1. 產品數據結構
```typescript
interface ProductData {
  id: string                    // 產品唯一標識
  name: string                  // 產品名稱
  category: string              // 產品類別
  revenue: number               // 總營收
  quantity: number              // 銷售數量
  unitPrice: number             // 單價
  costPrice: number             // 成本價
  profit: number                // 利潤
  profitMargin: number          // 利潤率
  inventoryLevel: number        // 當前庫存
  reorderPoint: number          // 再訂購點
  abcCategory: 'A' | 'B' | 'C'  // ABC分類
  lifecycleStage: string        // 生命週期階段
  daysSinceLaunch: number       // 上市天數
  turnoverRate: number          // 週轉率
  stockoutRisk: 'Low' | 'Medium' | 'High'  // 缺貨風險
  eoq: number                   // 經濟訂購量
  safetyStock: number           // 安全庫存
}
```

#### 2. 績效矩陣分析
```typescript
// 產品績效四象限分析
const generatePerformanceMatrix = (products: ProductData[]) => {
  return products.map(product => ({
    name: product.name,
    profitMargin: product.profitMargin * 100,    // Y軸：利潤率
    turnoverRate: product.turnoverRate,          // X軸：週轉率
    revenue: product.revenue,                    // 氣泡大小
    category: product.abcCategory                // 顏色分類
  }))
}

// 四象限產品分類
const categorizeByPerformance = (profitMargin: number, turnoverRate: number) => {
  if (profitMargin > 20 && turnoverRate > 5) return '明星產品'     // 高利潤高週轉
  if (profitMargin > 20 && turnoverRate <= 5) return '現金牛'     // 高利潤低週轉
  if (profitMargin <= 20 && turnoverRate > 5) return '問題產品'    // 低利潤高週轉
  return '滯銷產品'                                                // 低利潤低週轉
}
```

### 視覺化實現

#### 1. ABC分布餅圖
```typescript
// 動態ABC分類分布
const abcDistribution = useMemo(() => {
  const distribution = { A: 0, B: 0, C: 0 }
  productData.forEach(product => {
    distribution[product.abcCategory]++
  })
  
  return Object.entries(distribution).map(([category, count]) => ({
    name: `${category}類產品`,
    value: count,
    percentage: ((count / productData.length) * 100).toFixed(1),
    itemStyle: {
      color: category === 'A' ? '#10B981' : category === 'B' ? '#3B82F6' : '#6B7280'
    }
  }))
}, [productData])
```

#### 2. 績效散點圖
```typescript
// 產品績效矩陣散點圖
const performanceScatterOption = {
  grid: { left: '10%', right: '10%', top: '15%', bottom: '15%' },
  xAxis: {
    type: 'value',
    name: '週轉率',
    nameLocation: 'middle',
    nameGap: 30
  },
  yAxis: {
    type: 'value',
    name: '利潤率 (%)',
    nameLocation: 'middle',
    nameGap: 40
  },
  series: [{
    type: 'scatter',
    data: performanceMatrix.map(item => [
      item.turnoverRate,           // X: 週轉率
      item.profitMargin,          // Y: 利潤率
      item.revenue,               // 氣泡大小數據
      item.name,                  // 產品名稱
      item.category               // ABC分類
    ]),
    symbolSize: (data) => Math.sqrt(data[2]) / 100,  // 根據營收調整氣泡大小
    itemStyle: {
      color: (params) => {
        const category = params.data[4]
        return category === 'A' ? '#10B981' : category === 'B' ? '#3B82F6' : '#6B7280'
      }
    }
  }]
}
```

### 智能建議系統

#### 1. 庫存建議算法
```typescript
// 智能庫存建議生成器
const generateInventoryRecommendations = (products: ProductData[]) => {
  const recommendations = []
  
  products.forEach(product => {
    // 補貨建議
    if (product.inventoryLevel < product.reorderPoint) {
      recommendations.push({
        type: 'reorder',
        priority: 'high',
        productName: product.name,
        currentStock: product.inventoryLevel,
        recommendedOrder: product.eoq,
        message: `建議立即訂購 ${product.eoq} 件，當前庫存已低於安全水位`
      })
    }
    
    // 風險警告
    if (product.stockoutRisk === 'High') {
      recommendations.push({
        type: 'risk',
        priority: 'medium',
        productName: product.name,
        currentStock: product.inventoryLevel,
        safetyStock: product.safetyStock,
        message: `高缺貨風險，建議提升安全庫存至 ${product.safetyStock} 件`
      })
    }
    
    // 過量庫存優化
    if (product.turnoverRate < 2 && product.inventoryLevel > product.eoq * 1.5) {
      recommendations.push({
        type: 'excess',
        priority: 'low',
        productName: product.name,
        currentStock: product.inventoryLevel,
        optimalStock: Math.round(product.eoq),
        message: `庫存過多，建議減少至 ${Math.round(product.eoq)} 件以降低持有成本`
      })
    }
  })
  
  return recommendations
}
```

#### 2. 產品策略建議
```typescript
// 基於ABC分析的策略建議
const generateProductStrategy = (product: ProductData) => {
  const strategies = {
    A: {
      focus: '重點管理',
      inventory: '高庫存水位，確保不缺貨',
      pricing: '可適度提價，客戶對價格不敏感',
      promotion: '精準行銷，提升客戶忠誠度'
    },
    B: {
      focus: '成長潛力',
      inventory: '中等庫存水位，平衡成本與服務',
      pricing: '價格優化，尋找提升空間',
      promotion: '加強推廣，爭取升級為A類'
    },
    C: {
      focus: '簡化管理',
      inventory: '低庫存水位，降低持有成本',
      pricing: '成本導向定價',
      promotion: '考慮淘汰或組合銷售'
    }
  }
  
  return strategies[product.abcCategory]
}
```

### 性能優化策略

#### 1. 大數據處理
```typescript
// 產品數據虛擬化渲染
const useProductVirtualization = (products: ProductData[], pageSize: number = 50) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [sortConfig, setSortConfig] = useState({ key: 'revenue', direction: 'desc' })
  
  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => {
      const aValue = a[sortConfig.key]
      const bValue = b[sortConfig.key]
      
      if (sortConfig.direction === 'desc') {
        return bValue - aValue
      }
      return aValue - bValue
    })
  }, [products, sortConfig])
  
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return sortedProducts.slice(startIndex, startIndex + pageSize)
  }, [sortedProducts, currentPage, pageSize])
  
  return { paginatedProducts, currentPage, setCurrentPage, sortConfig, setSortConfig }
}
```

#### 2. 計算結果緩存
```typescript
// ABC分析結果緩存
const useABCAnalysisCache = () => {
  const cacheRef = useRef(new Map())
  
  const getCachedABCAnalysis = useCallback((products: ProductData[]) => {
    const cacheKey = products.map(p => `${p.id}-${p.revenue}`).join('|')
    
    if (cacheRef.current.has(cacheKey)) {
      return cacheRef.current.get(cacheKey)
    }
    
    const analysisResult = performABCAnalysis(products)
    cacheRef.current.set(cacheKey, analysisResult)
    
    // 限制緩存大小
    if (cacheRef.current.size > 10) {
      const firstKey = cacheRef.current.keys().next().value
      cacheRef.current.delete(firstKey)
    }
    
    return analysisResult
  }, [])
  
  return getCachedABCAnalysis
}
```

### 業務智能分析

#### 1. 帕累托分析
```typescript
// 80/20法則驗證
const validateParetoRule = (products: ProductData[]) => {
  const sortedByRevenue = products.sort((a, b) => b.revenue - a.revenue)
  const totalRevenue = sortedByRevenue.reduce((sum, p) => sum + p.revenue, 0)
  
  let cumulativeRevenue = 0
  let productCount = 0
  
  for (const product of sortedByRevenue) {
    cumulativeRevenue += product.revenue
    productCount++
    
    const revenuePercent = (cumulativeRevenue / totalRevenue) * 100
    const productPercent = (productCount / products.length) * 100
    
    if (revenuePercent >= 80) {
      return {
        paretoRatio: `${productPercent.toFixed(1)}%/${revenuePercent.toFixed(1)}%`,
        isValidPareto: productPercent <= 25,  // 25%的產品貢獻80%以上營收
        topProductCount: productCount,
        topProductRevenue: cumulativeRevenue
      }
    }
  }
  
  return null
}
```

#### 2. 季節性分析
```typescript
// 產品季節性模式檢測
const detectSeasonality = (salesHistory: number[]) => {
  const seasonalityScore = calculateSeasonalityScore(salesHistory)
  const peakSeason = findPeakSeason(salesHistory)
  const volatility = calculateVolatility(salesHistory)
  
  return {
    hasSeasonality: seasonalityScore > 0.3,
    seasonalityStrength: seasonalityScore,
    peakSeason,
    volatility,
    recommendation: generateSeasonalStrategy(seasonalityScore, peakSeason)
  }
}
```

## 📊 MODULE 05: 客戶分群實驗室 技術詳解

### 核心功能實現

#### 1. 機器學習聚類算法

##### K-Means 聚類實現
```typescript
// K-Means 聚類核心算法
const performKMeans = (data: number[][], k: number, maxIterations: number = 100) => {
  const n = data.length
  const d = data[0].length
  
  // 初始化聚類中心 - 使用 K-Means++ 方法
  let centers = initializeCentersKMeansPlusPlus(data, k)
  let labels = new Array(n).fill(0)
  let hasConverged = false
  
  for (let iteration = 0; iteration < maxIterations && !hasConverged; iteration++) {
    const oldLabels = [...labels]
    
    // 分配步驟：將每個點分配到最近的聚類中心
    for (let i = 0; i < n; i++) {
      let minDistance = Infinity
      let bestCluster = 0
      
      for (let c = 0; c < k; c++) {
        const distance = euclideanDistance(data[i], centers[c])
        if (distance < minDistance) {
          minDistance = distance
          bestCluster = c
        }
      }
      labels[i] = bestCluster
    }
    
    // 更新步驟：重新計算聚類中心
    const newCenters = Array.from({ length: k }, () => Array(d).fill(0))
    const counts = Array(k).fill(0)
    
    for (let i = 0; i < n; i++) {
      const cluster = labels[i]
      counts[cluster]++
      for (let j = 0; j < d; j++) {
        newCenters[cluster][j] += data[i][j]
      }
    }
    
    for (let c = 0; c < k; c++) {
      if (counts[c] > 0) {
        for (let j = 0; j < d; j++) {
          newCenters[c][j] /= counts[c]
        }
      }
    }
    
    // 檢查收斂性
    hasConverged = arraysEqual(oldLabels, labels)
    centers = newCenters
  }
  
  return { labels, centers, hasConverged }
}

// K-Means++ 初始化方法
const initializeCentersKMeansPlusPlus = (data: number[][], k: number) => {
  const centers = []
  const n = data.length
  
  // 第一個中心隨機選擇
  centers.push([...data[Math.floor(Math.random() * n)]])
  
  // 選擇其餘的中心
  for (let c = 1; c < k; c++) {
    const distances = data.map(point => {
      let minDist = Infinity
      for (const center of centers) {
        const dist = euclideanDistance(point, center)
        minDist = Math.min(minDist, dist)
      }
      return minDist * minDist
    })
    
    const totalDistance = distances.reduce((sum, d) => sum + d, 0)
    const target = Math.random() * totalDistance
    
    let cumulativeDistance = 0
    for (let i = 0; i < n; i++) {
      cumulativeDistance += distances[i]
      if (cumulativeDistance >= target) {
        centers.push([...data[i]])
        break
      }
    }
  }
  
  return centers
}
```

##### 階層聚類實現
```typescript
// 凝聚層次聚類實現
const performHierarchicalClustering = (
  data: number[][], 
  linkage: 'ward' | 'complete' | 'average' | 'single' = 'ward'
) => {
  const n = data.length
  const clusters = data.map((point, index) => ({ id: index, points: [point] }))
  const dendrogram = []
  
  while (clusters.length > 1) {
    let minDistance = Infinity
    let mergeIndices = [0, 1]
    
    // 找到最接近的兩個聚類
    for (let i = 0; i < clusters.length; i++) {
      for (let j = i + 1; j < clusters.length; j++) {
        const distance = calculateClusterDistance(clusters[i], clusters[j], linkage)
        if (distance < minDistance) {
          minDistance = distance
          mergeIndices = [i, j]
        }
      }
    }
    
    // 合併聚類
    const [i, j] = mergeIndices
    const newCluster = {
      id: n + dendrogram.length,
      points: [...clusters[i].points, ...clusters[j].points],
      children: [clusters[i].id, clusters[j].id],
      distance: minDistance
    }
    
    dendrogram.push({
      left: clusters[i].id,
      right: clusters[j].id,
      distance: minDistance,
      size: newCluster.points.length
    })
    
    // 移除被合併的聚類，添加新聚類
    clusters.splice(Math.max(i, j), 1)
    clusters.splice(Math.min(i, j), 1)
    clusters.push(newCluster)
  }
  
  return { dendrogram, rootCluster: clusters[0] }
}

// 聚類間距離計算
const calculateClusterDistance = (cluster1: any, cluster2: any, linkage: string) => {
  switch (linkage) {
    case 'ward':
      return calculateWardDistance(cluster1.points, cluster2.points)
    case 'complete':
      return calculateCompleteDistance(cluster1.points, cluster2.points)
    case 'average':
      return calculateAverageDistance(cluster1.points, cluster2.points)
    case 'single':
      return calculateSingleDistance(cluster1.points, cluster2.points)
    default:
      return calculateAverageDistance(cluster1.points, cluster2.points)
  }
}
```

##### DBSCAN 密度聚類實現
```typescript
// DBSCAN 密度聚類算法
const performDBSCAN = (data: number[][], eps: number, minPts: number) => {
  const n = data.length
  const labels = Array(n).fill(-1) // -1 表示噪聲點
  const visited = Array(n).fill(false)
  let clusterId = 0
  
  // 計算所有點對之間的距離矩陣
  const distanceMatrix = calculateDistanceMatrix(data)
  
  for (let i = 0; i < n; i++) {
    if (visited[i]) continue
    visited[i] = true
    
    // 找到鄰居點
    const neighbors = findNeighbors(i, distanceMatrix, eps)
    
    if (neighbors.length < minPts) {
      // 標記為噪聲點
      labels[i] = -1
    } else {
      // 開始新聚類
      expandCluster(i, neighbors, clusterId, labels, visited, distanceMatrix, eps, minPts)
      clusterId++
    }
  }
  
  return {
    labels,
    nClusters: clusterId,
    nNoise: labels.filter(label => label === -1).length
  }
}

// 擴展聚類
const expandCluster = (
  pointIndex: number, 
  neighbors: number[], 
  clusterId: number, 
  labels: number[], 
  visited: boolean[], 
  distanceMatrix: number[][], 
  eps: number, 
  minPts: number
) => {
  labels[pointIndex] = clusterId
  
  for (let i = 0; i < neighbors.length; i++) {
    const neighborIndex = neighbors[i]
    
    if (!visited[neighborIndex]) {
      visited[neighborIndex] = true
      const neighborNeighbors = findNeighbors(neighborIndex, distanceMatrix, eps)
      
      if (neighborNeighbors.length >= minPts) {
        neighbors.push(...neighborNeighbors)
      }
    }
    
    if (labels[neighborIndex] === -1) {
      labels[neighborIndex] = clusterId
    }
  }
}
```

#### 2. 主成分分析 (PCA) 實現

```typescript
// PCA 降維實現
const performPCA = (data: number[][], nComponents: number = 2) => {
  const n = data.length
  const d = data[0].length
  
  // 數據標準化
  const standardizedData = standardizeData(data)
  
  // 計算協方差矩陣
  const covarianceMatrix = calculateCovarianceMatrix(standardizedData)
  
  // 特徵值分解
  const { eigenvalues, eigenvectors } = eigenDecomposition(covarianceMatrix)
  
  // 排序特徵值和特徵向量
  const sortedIndices = eigenvalues
    .map((val, idx) => ({ val, idx }))
    .sort((a, b) => b.val - a.val)
    .map(item => item.idx)
  
  // 選擇前 nComponents 個主成分
  const selectedEigenvectors = sortedIndices
    .slice(0, nComponents)
    .map(idx => eigenvectors[idx])
  
  // 投影數據到主成分空間
  const transformedData = standardizedData.map(row => 
    selectedEigenvectors.map(eigenvector => 
      row.reduce((sum, val, idx) => sum + val * eigenvector[idx], 0)
    )
  )
  
  // 計算解釋方差比
  const totalVariance = eigenvalues.reduce((sum, val) => sum + val, 0)
  const explainedVarianceRatio = sortedIndices
    .slice(0, nComponents)
    .map(idx => eigenvalues[idx] / totalVariance)
  
  return {
    transformedData,
    explainedVarianceRatio,
    cumulativeVarianceRatio: explainedVarianceRatio.reduce((acc, val, idx) => {
      acc.push((acc[idx - 1] || 0) + val)
      return acc
    }, []),
    principalComponents: selectedEigenvectors
  }
}

// 矩陣特徵值分解（簡化版實現）
const eigenDecomposition = (matrix: number[][]) => {
  // 這裡使用簡化的 Power Method 或調用數值計算庫
  // 實際項目中建議使用成熟的數值計算庫如 ml-matrix
  return {
    eigenvalues: [],
    eigenvectors: []
  }
}
```

#### 3. 聚類評估指標

```typescript
// 輪廓係數計算
const calculateSilhouetteScore = (data: number[][], labels: number[]) => {
  const n = data.length
  const silhouetteScores = []
  
  for (let i = 0; i < n; i++) {
    const clusterLabel = labels[i]
    if (clusterLabel === -1) continue // 跳過噪聲點
    
    // 計算 a(i): 點 i 到同一聚類內其他點的平均距離
    const sameClusterPoints = data.filter((_, idx) => labels[idx] === clusterLabel && idx !== i)
    const a = sameClusterPoints.length > 0 
      ? sameClusterPoints.reduce((sum, point) => sum + euclideanDistance(data[i], point), 0) / sameClusterPoints.length
      : 0
    
    // 計算 b(i): 點 i 到最近鄰聚類的平均距離
    const otherClusters = [...new Set(labels.filter(label => label !== clusterLabel && label !== -1))]
    let minAvgDistance = Infinity
    
    for (const otherCluster of otherClusters) {
      const otherClusterPoints = data.filter((_, idx) => labels[idx] === otherCluster)
      const avgDistance = otherClusterPoints.reduce((sum, point) => sum + euclideanDistance(data[i], point), 0) / otherClusterPoints.length
      minAvgDistance = Math.min(minAvgDistance, avgDistance)
    }
    
    const b = minAvgDistance
    
    // 輪廓係數 s(i) = (b(i) - a(i)) / max(a(i), b(i))
    const silhouetteScore = (b - a) / Math.max(a, b)
    silhouetteScores.push(silhouetteScore)
  }
  
  return silhouetteScores.reduce((sum, score) => sum + score, 0) / silhouetteScores.length
}

// Davies-Bouldin 指數計算
const calculateDaviesBouldinIndex = (data: number[][], labels: number[], centers: number[][]) => {
  const clusters = [...new Set(labels.filter(label => label !== -1))]
  const dbIndex = []
  
  for (let i = 0; i < clusters.length; i++) {
    const clusterI = clusters[i]
    const pointsI = data.filter((_, idx) => labels[idx] === clusterI)
    
    // 計算聚類內散度
    const scatterI = pointsI.reduce((sum, point) => sum + euclideanDistance(point, centers[i]), 0) / pointsI.length
    
    let maxRatio = 0
    for (let j = 0; j < clusters.length; j++) {
      if (i === j) continue
      
      const clusterJ = clusters[j]
      const pointsJ = data.filter((_, idx) => labels[idx] === clusterJ)
      const scatterJ = pointsJ.reduce((sum, point) => sum + euclideanDistance(point, centers[j]), 0) / pointsJ.length
      
      // 聚類間距離
      const centerDistance = euclideanDistance(centers[i], centers[j])
      
      // DB 比率
      const ratio = (scatterI + scatterJ) / centerDistance
      maxRatio = Math.max(maxRatio, ratio)
    }
    
    dbIndex.push(maxRatio)
  }
  
  return dbIndex.reduce((sum, val) => sum + val, 0) / dbIndex.length
}

// 肘部法則 - 計算 SSE
const calculateSSE = (data: number[][], labels: number[], centers: number[][]) => {
  let sse = 0
  
  for (let i = 0; i < data.length; i++) {
    const clusterLabel = labels[i]
    if (clusterLabel !== -1) {
      const distance = euclideanDistance(data[i], centers[clusterLabel])
      sse += distance * distance
    }
  }
  
  return sse
}
```

#### 4. 客戶群組標籤生成系統

```typescript
// 智能客戶群組標籤生成器
const generateSegmentLabels = (clusters: any[], customerData: any[]) => {
  return clusters.map(cluster => {
    const customers = cluster.points || []
    
    // 計算群組特徵統計
    const avgRFM = {
      recency: mean(customers.map(c => c.recency)),
      frequency: mean(customers.map(c => c.frequency)),
      monetary: mean(customers.map(c => c.monetary))
    }
    
    const avgLTV = mean(customers.map(c => c.totalLifetimeValue))
    const avgAge = mean(customers.map(c => c.accountAge))
    const riskLevel = mean(customers.map(c => c.riskScore))
    
    // 基於規則的標籤分配邏輯
    let label = '其他客戶'
    let emoji = '👤'
    let strategy = []
    
    if (avgRFM.recency <= 30 && avgRFM.frequency >= 10 && avgRFM.monetary >= 20000) {
      label = '冠軍客戶'
      emoji = '🏆'
      strategy = ['VIP專屬服務', '早期新品體驗', '個人專屬客戶經理']
    } else if (avgRFM.frequency >= 6 && avgRFM.monetary >= 10000 && riskLevel < 3) {
      label = '忠誠客戶'
      emoji = '💎'
      strategy = ['會員等級升級', '個性化推薦', '限時專屬優惠']
    } else if (avgAge <= 90 && avgRFM.frequency >= 3) {
      label = '新客戶'
      emoji = '🆕'
      strategy = ['新手專屬優惠', '產品使用指南', '客服主動聯繫']
    } else if (avgRFM.recency <= 60 && avgRFM.frequency <= 5 && avgLTV >= 8000) {
      label = '潛力客戶'
      emoji = '🌟'
      strategy = ['免費升級體驗', '交叉銷售推薦', '定期關懷跟進']
    } else if (avgRFM.recency > 90 && avgRFM.frequency >= 5) {
      label = '休眠客戶'
      emoji = '😴'
      strategy = ['挽回專屬優惠', '重新激活活動', '客服主動致電']
    }
    
    return {
      ...cluster,
      label: `${emoji} ${label}`,
      characteristics: {
        avgRecency: Math.round(avgRFM.recency),
        avgFrequency: Math.round(avgRFM.frequency),
        avgMonetary: Math.round(avgRFM.monetary),
        avgLTV: Math.round(avgLTV),
        riskLevel: riskLevel.toFixed(1),
        size: customers.length
      },
      recommendedStrategies: strategy
    }
  })
}
```

#### 5. ROI 預估和策略建議系統

```typescript
// ROI 投資回報率預估系統
const calculateROIProjection = (segment: any, investmentAmount: number = 10000) => {
  // 基於群組特徵預估轉換率和平均訂單價值
  const conversionRates = {
    '🏆 冠軍客戶': 0.85,
    '💎 忠誠客戶': 0.65,
    '🌟 潛力客戶': 0.45,
    '🆕 新客戶': 0.35,
    '😴 休眠客戶': 0.15
  }
  
  const avgOrderValues = {
    '🏆 冠軍客戶': 1500,
    '💎 忠誠客戶': 1200,
    '🌟 潛力客戶': 800,
    '🆕 新客戶': 600,
    '😴 休眠客戶': 400
  }
  
  const customerCount = segment.characteristics.size
  const estimatedConversionRate = conversionRates[segment.label] || 0.2
  const estimatedAOV = avgOrderValues[segment.label] || 500
  
  // ROI 計算
  const expectedCustomers = customerCount * estimatedConversionRate
  const expectedRevenue = expectedCustomers * estimatedAOV
  const netProfit = expectedRevenue - investmentAmount
  const roi = (netProfit / investmentAmount) * 100
  
  // 策略建議
  const strategies = getMarketingStrategies(segment.label, roi)
  
  return {
    segmentLabel: segment.label,
    customerCount,
    investmentAmount,
    expectedCustomers: Math.round(expectedCustomers),
    expectedRevenue: Math.round(expectedRevenue),
    netProfit: Math.round(netProfit),
    roi: Math.round(roi),
    paybackPeriod: calculatePaybackPeriod(investmentAmount, expectedRevenue),
    strategies
  }
}

// 營銷策略建議生成器
const getMarketingStrategies = (segmentLabel: string, roi: number) => {
  const baseStrategies = {
    '🏆 冠軍客戶': [
      { action: 'VIP活動邀請', budget: '高', timeline: '立即執行' },
      { action: '一對一客戶經理', budget: '高', timeline: '本月內' },
      { action: '專屬產品預覽', budget: '中', timeline: '持續進行' }
    ],
    '💎 忠誠客戶': [
      { action: '個性化郵件營銷', budget: '中', timeline: '每週' },
      { action: '會員升級計劃', budget: '中', timeline: '季度推廣' },
      { action: '推薦獎勵計劃', budget: '低', timeline: '持續進行' }
    ],
    '🌟 潛力客戶': [
      { action: '產品試用優惠', budget: '中', timeline: '月度活動' },
      { action: '教育內容營銷', budget: '低', timeline: '每週' },
      { action: '交叉銷售推薦', budget: '低', timeline: '購買後7天' }
    ]
  }
  
  const strategies = baseStrategies[segmentLabel] || []
  
  // 根據 ROI 調整策略優先級
  if (roi > 200) {
    strategies.unshift({ action: '增加投資預算', budget: '高', timeline: '立即執行' })
  } else if (roi < 50) {
    strategies.push({ action: '重新評估策略', budget: '低', timeline: '月度檢視' })
  }
  
  return strategies
}
```

### 數據模型架構

#### 1. 客戶特徵工程
```typescript
// 擴展客戶特徵模型
interface EnhancedCustomerData {
  customerId: string
  name: string
  
  // 基礎 RFM 特徵
  recency: number              // 最近購買天數
  frequency: number            // 購買頻率
  monetary: number             // 消費金額
  
  // 擴展客戶特徵
  totalLifetimeValue: number   // 客戶終身價值
  accountAge: number           // 帳戶年齡（天數）
  categoryPreference: string   // 偏好品類
  returnRate: number           // 退貨率
  seasonalityIndex: number     // 季節性指數
  riskScore: number            // 風險評分 (1-10)
  devicePreference: string     // 設備偏好
  locationScore: number        // 地理位置評分
  
  // 行為特徵
  avgOrderValue: number        // 平均訂單價值
  orderFrequency: number       // 訂單頻率
  avgSessionDuration: number   // 平均會話時長
  pageViewsPerSession: number  // 每次會話頁面瀏覽數
  
  // 聚類結果
  clusterId: number            // 聚類標籤
  clusterLabel: string         // 人性化標籤
  clusterDistance: number      // 到聚類中心距離
}
```

### 視覺化技術實現

#### 1. 動態 3D 散點圖
```typescript
// PCA 結果 3D 視覺化
const PCA3DScatterChart = ({ pcaData, clusterLabels, clusterColors }) => {
  const scatter3DOption = useMemo(() => ({
    grid3D: {
      axisLine: { lineStyle: { color: '#fff' } },
      axisPointer: { lineStyle: { color: '#fff' } }
    },
    xAxis3D: { name: 'PC1', type: 'value' },
    yAxis3D: { name: 'PC2', type: 'value' },
    zAxis3D: { name: 'PC3', type: 'value' },
    series: [{
      type: 'scatter3D',
      data: pcaData.map((point, index) => ({
        value: point,
        itemStyle: { color: clusterColors[clusterLabels[index]] }
      })),
      symbolSize: 6,
      emphasis: {
        itemStyle: { color: '#fff' }
      }
    }]
  }), [pcaData, clusterLabels, clusterColors])
  
  return <EChartsReact option={scatter3DOption} style={{ height: '500px' }} />
}
```

#### 2. 互動式聚類樹狀圖
```typescript
// 階層聚類樹狀圖
const HierarchicalClusterTree = ({ dendrogram, onNodeClick }) => {
  const treeOption = useMemo(() => ({
    series: [{
      type: 'tree',
      data: [transformDendrogramToTree(dendrogram)],
      top: '10%',
      left: '20%',
      bottom: '22%',
      right: '20%',
      symbolSize: 8,
      label: {
        position: 'left',
        verticalAlign: 'middle',
        align: 'right'
      },
      leaves: {
        label: {
          position: 'right',
          verticalAlign: 'middle',
          align: 'left'
        }
      },
      emphasis: {
        focus: 'descendant'
      },
      expandAndCollapse: true,
      animationDuration: 550,
      animationDurationUpdate: 750
    }]
  }), [dendrogram])
  
  const handleEvents = {
    click: (params) => {
      if (onNodeClick) {
        onNodeClick(params.data)
      }
    }
  }
  
  return (
    <EChartsReact 
      option={treeOption} 
      onEvents={handleEvents}
      style={{ height: '600px' }} 
    />
  )
}
```

### 性能優化策略

#### 1. Web Workers 用於大數據計算
```typescript
// 聚類計算 Web Worker
const useClusteringWorker = () => {
  const workerRef = useRef<Worker>()
  
  useEffect(() => {
    workerRef.current = new Worker('/workers/clustering-worker.js')
    return () => workerRef.current?.terminate()
  }, [])
  
  const performClustering = useCallback((data, algorithm, params) => {
    return new Promise((resolve) => {
      workerRef.current.postMessage({ data, algorithm, params })
      workerRef.current.onmessage = (e) => resolve(e.data)
    })
  }, [])
  
  return performClustering
}

// clustering-worker.js
self.onmessage = function(e) {
  const { data, algorithm, params } = e.data
  
  let result
  switch (algorithm) {
    case 'kmeans':
      result = performKMeans(data, params.k)
      break
    case 'hierarchical':
      result = performHierarchicalClustering(data, params.linkage)
      break
    case 'dbscan':
      result = performDBSCAN(data, params.eps, params.minPts)
      break
  }
  
  self.postMessage(result)
}
```

#### 2. 增量聚類更新
```typescript
// 增量客戶數據更新
const useIncrementalClustering = (initialData, algorithm = 'kmeans') => {
  const [clusterResult, setClusterResult] = useState(null)
  const [dataBuffer, setDataBuffer] = useState([])
  
  const addNewCustomers = useCallback((newCustomers) => {
    setDataBuffer(prev => [...prev, ...newCustomers])
  }, [])
  
  // 定期批次更新聚類
  useEffect(() => {
    const interval = setInterval(() => {
      if (dataBuffer.length > 10) { // 累積足夠數據再更新
        const updatedData = [...initialData, ...dataBuffer]
        performClustering(updatedData, algorithm).then(result => {
          setClusterResult(result)
          setDataBuffer([]) // 清空緩衝區
        })
      }
    }, 30000) // 每30秒檢查一次
    
    return () => clearInterval(interval)
  }, [dataBuffer, initialData, algorithm])
  
  return { clusterResult, addNewCustomers }
}
```

### 業務智能分析

#### 1. 客戶群組遷移分析
```typescript
// 客戶群組轉換分析
const analyzeSegmentMigration = (historicalData: any[], currentData: any[]) => {
  const migrationMatrix = {}
  
  // 構建遷移矩陣
  historicalData.forEach(customer => {
    const currentCustomer = currentData.find(c => c.customerId === customer.customerId)
    if (currentCustomer) {
      const fromSegment = customer.clusterLabel
      const toSegment = currentCustomer.clusterLabel
      
      if (!migrationMatrix[fromSegment]) {
        migrationMatrix[fromSegment] = {}
      }
      
      migrationMatrix[fromSegment][toSegment] = 
        (migrationMatrix[fromSegment][toSegment] || 0) + 1
    }
  })
  
  // 計算遷移率
  const migrationRates = {}
  Object.keys(migrationMatrix).forEach(fromSegment => {
    const total = Object.values(migrationMatrix[fromSegment]).reduce((sum, count) => sum + count, 0)
    migrationRates[fromSegment] = {}
    
    Object.keys(migrationMatrix[fromSegment]).forEach(toSegment => {
      migrationRates[fromSegment][toSegment] = 
        (migrationMatrix[fromSegment][toSegment] / total * 100).toFixed(1)
    })
  })
  
  return { migrationMatrix, migrationRates }
}
```

#### 2. 聚類穩定性評估
```typescript
// 聚類結果穩定性分析
const assessClusterStability = (clusterResults: any[], timeWindows: string[]) => {
  const stabilityMetrics = {
    adjustedRandIndex: [],
    silhouetteConsistency: [],
    clusterSizeVariability: []
  }
  
  for (let i = 1; i < clusterResults.length; i++) {
    const prev = clusterResults[i - 1]
    const curr = clusterResults[i]
    
    // 計算調整蘭德指數 (Adjusted Rand Index)
    const ari = calculateAdjustedRandIndex(prev.labels, curr.labels)
    stabilityMetrics.adjustedRandIndex.push({
      period: `${timeWindows[i-1]} → ${timeWindows[i]}`,
      value: ari
    })
    
    // 輪廓係數一致性
    const silhouetteDiff = Math.abs(prev.silhouetteScore - curr.silhouetteScore)
    stabilityMetrics.silhouetteConsistency.push({
      period: `${timeWindows[i-1]} → ${timeWindows[i]}`,
      value: 1 - silhouetteDiff // 差異越小，一致性越高
    })
  }
  
  return stabilityMetrics
}
```

## 📊 MODULE 06: 商品關聯分析器 技術詳解

### 核心功能實現

#### 1. 關聯規則挖掘算法

##### Apriori 算法實現
```typescript
// Apriori 算法核心實現
const aprioriAlgorithm = (transactions: TransactionData[], minSupport: number) => {
  const totalTransactions = transactions.length
  
  // 第一輪掃描：計算單項目支持度
  const itemSupport = new Map<string, number>()
  const itemsetTransactions = new Map<string, Set<string>>()
  
  transactions.forEach((transaction, index) => {
    transaction.items.forEach(item => {
      const count = itemSupport.get(item) || 0
      itemSupport.set(item, count + 1)
      
      if (!itemsetTransactions.has(item)) {
        itemsetTransactions.set(item, new Set())
      }
      itemsetTransactions.get(item)!.add(transaction.transactionId)
    })
  })

  // 剪枝：過濾低支持度項目
  const frequentItems = Array.from(itemSupport.entries())
    .filter(([item, count]) => count / totalTransactions >= minSupport)
    .map(([item]) => item)

  // 生成候選2-項目集
  const itemPairs = []
  for (let i = 0; i < frequentItems.length; i++) {
    for (let j = i + 1; j < frequentItems.length; j++) {
      itemPairs.push([frequentItems[i], frequentItems[j]])
    }
  }

  // 第二輪掃描：計算項目對支持度
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

##### FP-Growth 算法實現
```typescript
// FP-Growth 算法 - 更高效的頻繁模式挖掘
class FPNode {
  item: string
  count: number
  parent: FPNode | null
  children: Map<string, FPNode>
  nodeLink: FPNode | null

  constructor(item: string, count: number, parent: FPNode | null) {
    this.item = item
    this.count = count
    this.parent = parent
    this.children = new Map()
    this.nodeLink = null
  }
}

const fpGrowthAlgorithm = (transactions: TransactionData[], minSupport: number) => {
  const totalTransactions = transactions.length
  
  // 步驟1：計算項目頻率並排序
  const itemFrequency = new Map<string, number>()
  transactions.forEach(transaction => {
    transaction.items.forEach(item => {
      const count = itemFrequency.get(item) || 0
      itemFrequency.set(item, count + 1)
    })
  })

  // 步驟2：按頻率過濾和排序
  const frequentItems = Array.from(itemFrequency.entries())
    .filter(([item, count]) => count / totalTransactions >= minSupport)
    .sort((a, b) => b[1] - a[1])
    .map(([item]) => item)

  // 步驟3：構建FP-Tree
  const root = new FPNode('root', 0, null)
  const headerTable = new Map<string, FPNode>()

  transactions.forEach(transaction => {
    // 按全域頻率排序交易項目
    const sortedItems = transaction.items
      .filter(item => frequentItems.includes(item))
      .sort((a, b) => frequentItems.indexOf(a) - frequentItems.indexOf(b))

    // 將交易插入FP-Tree
    let currentNode = root
    sortedItems.forEach(item => {
      if (currentNode.children.has(item)) {
        currentNode.children.get(item)!.count++
      } else {
        const newNode = new FPNode(item, 1, currentNode)
        currentNode.children.set(item, newNode)
        
        // 更新header table的node-link
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

  // 步驟4：遞歸挖掘頻繁模式
  const frequentItemsets = new Map<string, number>()
  
  const minePatterns = (tree: FPNode, alpha: string[], minCount: number) => {
    frequentItems.slice().reverse().forEach(item => {
      const conditionalPatternBase: string[][] = []
      let node = headerTable.get(item)
      
      // 收集條件模式基
      while (node) {
        if (node.count >= minCount) {
          const path: string[] = []
          let parent = node.parent
          while (parent && parent.item !== 'root') {
            path.unshift(parent.item)
            parent = parent.parent
          }
          if (path.length > 0) {
            for (let i = 0; i < node.count; i++) {
              conditionalPatternBase.push([...path])
            }
          }
        }
        node = node.nodeLink
      }

      // 生成頻繁項目集
      if (conditionalPatternBase.length >= minCount) {
        const itemset = [...alpha, item].sort().join(',')
        frequentItemsets.set(itemset, conditionalPatternBase.length)
      }
    })
  }

  minePatterns(root, [], Math.ceil(totalTransactions * minSupport))
  return { frequentItemsets, itemFrequency }
}
```

#### 2. 關聯規則生成和評估

```typescript
// 關聯規則生成引擎
const generateAssociationRules = (
  transactions: TransactionData[],
  minSupport: number,
  minConfidence: number,
  minLift: number
): AssociationRule[] => {
  // 使用選定算法獲取頻繁項目集
  const { itemSupport, pairSupport } = aprioriAlgorithm(transactions, minSupport)
  const totalTransactions = transactions.length
  const rules: AssociationRule[] = []

  pairSupport.forEach((support, pairKey) => {
    const [itemA, itemB] = pairKey.split(',')
    
    // 生成規則 A → B
    const supportA = (itemSupport.get(itemA) || 0) / totalTransactions
    const supportB = (itemSupport.get(itemB) || 0) / totalTransactions
    const confidenceAB = support / supportA
    const liftAB = confidenceAB / supportB
    const convictionAB = (1 - supportB) / (1 - confidenceAB)

    if (confidenceAB >= minConfidence && liftAB >= minLift) {
      rules.push({
        antecedent: [itemA],
        consequent: [itemB],
        support,
        confidence: confidenceAB,
        lift: liftAB,
        conviction: convictionAB
      })
    }

    // 生成規則 B → A
    const confidenceBA = support / supportB
    const liftBA = confidenceBA / supportA
    const convictionBA = (1 - supportA) / (1 - confidenceBA)

    if (confidenceBA >= minConfidence && liftBA >= minLift) {
      rules.push({
        antecedent: [itemB],
        consequent: [itemA],
        support,
        confidence: confidenceBA,
        lift: liftBA,
        conviction: convictionBA
      })
    }
  })

  return rules.sort((a, b) => b.lift - a.lift)
}

// 規則品質評估指標
const evaluateRuleQuality = (rule: AssociationRule) => {
  const { support, confidence, lift, conviction } = rule
  
  // 多維度品質評分
  const supportScore = Math.min(support * 100, 10)        // 支持度權重10%
  const confidenceScore = confidence * 30                 // 信心度權重30%
  const liftScore = Math.min(lift / 3, 1) * 40           // 提升度權重40%
  const convictionScore = Math.min(conviction / 5, 1) * 20 // 確信度權重20%
  
  const qualityScore = supportScore + confidenceScore + liftScore + convictionScore
  
  return {
    qualityScore: Math.round(qualityScore),
    grade: qualityScore >= 80 ? 'A' : qualityScore >= 60 ? 'B' : qualityScore >= 40 ? 'C' : 'D',
    recommendation: generateQualityRecommendation(qualityScore, rule)
  }
}
```

#### 3. 智能推薦系統

```typescript
// 基於關聯規則的推薦引擎
class MarketBasketRecommendationEngine {
  private rules: AssociationRule[]
  private productCatalog: Map<string, ProductInfo>
  
  constructor(rules: AssociationRule[], catalog: Map<string, ProductInfo>) {
    this.rules = rules.sort((a, b) => b.lift - a.lift) // 按提升度排序
    this.productCatalog = catalog
  }

  // 基於當前購物車生成推薦
  generateRecommendations(
    currentBasket: string[], 
    maxRecommendations: number = 10
  ): ProductRecommendation[] {
    const recommendations = new Map<string, {
      score: number,
      frequency: number,
      rules: AssociationRule[]
    }>()

    this.rules.forEach(rule => {
      // 檢查前項是否包含在當前購物籃中
      const isApplicable = rule.antecedent.every(item => currentBasket.includes(item))
      
      if (isApplicable) {
        rule.consequent.forEach(product => {
          // 避免推薦已在購物籃中的商品
          if (!currentBasket.includes(product)) {
            const existing = recommendations.get(product)
            const ruleScore = rule.lift * rule.confidence * rule.support // 綜合評分
            
            if (existing) {
              existing.score += ruleScore
              existing.frequency += 1
              existing.rules.push(rule)
            } else {
              recommendations.set(product, {
                score: ruleScore,
                frequency: 1,
                rules: [rule]
              })
            }
          }
        })
      }
    })

    // 轉換為推薦列表並排序
    return Array.from(recommendations.entries())
      .sort((a, b) => b[1].score - a[1].score)
      .slice(0, maxRecommendations)
      .map(([productId, data]) => ({
        productId,
        productName: this.productCatalog.get(productId)?.name || productId,
        recommendationScore: data.score,
        frequency: data.frequency,
        basedOnRules: data.rules.map(rule => 
          `${rule.antecedent.join(', ')} → ${rule.consequent.join(', ')}`
        ),
        confidence: this.calculateAverageConfidence(data.rules),
        explanation: this.generateExplanation(productId, currentBasket, data.rules)
      }))
  }

  private calculateAverageConfidence(rules: AssociationRule[]): number {
    const totalConfidence = rules.reduce((sum, rule) => sum + rule.confidence, 0)
    return totalConfidence / rules.length
  }

  private generateExplanation(
    productId: string, 
    basket: string[], 
    rules: AssociationRule[]
  ): string {
    const bestRule = rules.sort((a, b) => b.confidence - a.confidence)[0]
    const confidence = (bestRule.confidence * 100).toFixed(0)
    
    return `購買 ${bestRule.antecedent.join('、')} 的客戶有 ${confidence}% 也會購買此商品`
  }

  // 交叉銷售機會分析
  identifyCrossSellOpportunities(
    salesData: TransactionData[],
    minRevenuePotential: number = 1000
  ): CrossSellOpportunity[] {
    return this.rules
      .filter(rule => rule.lift > 1.5 && rule.confidence > 0.4)
      .map(rule => {
        const affectedTransactions = Math.floor(rule.support * salesData.length)
        const estimatedRevenue = affectedTransactions * rule.confidence * 50 // 假設平均增益50元
        
        return {
          rule,
          affectedTransactions,
          estimatedRevenue: Math.round(estimatedRevenue),
          priority: rule.lift * rule.confidence * rule.support,
          implementation: this.suggestImplementation(rule)
        }
      })
      .filter(opp => opp.estimatedRevenue >= minRevenuePotential)
      .sort((a, b) => b.priority - a.priority)
  }

  private suggestImplementation(rule: AssociationRule): string {
    if (rule.lift > 3) {
      return '強烈建議：設計套餐組合促銷'
    } else if (rule.lift > 2) {
      return '建議：調整商品陳列位置至相鄰區域'
    } else {
      return '可考慮：加入推薦商品清單'
    }
  }
}
```

#### 4. 市場籃分析統計

```typescript
// 綜合市場籃分析統計
interface MarketBasketAnalytics {
  basicStats: BasicStats
  purchasePatterns: PurchasePattern[]
  temporalAnalysis: TemporalAnalysis
  productPerformance: ProductPerformance[]
}

const performMarketBasketAnalytics = (
  transactions: TransactionData[]
): MarketBasketAnalytics => {
  // 基礎統計
  const basicStats = calculateBasicStats(transactions)
  
  // 購買模式分析
  const purchasePatterns = analyzePurchasePatterns(transactions)
  
  // 時間序列分析
  const temporalAnalysis = analyzeTemporalPatterns(transactions)
  
  // 商品表現分析
  const productPerformance = analyzeProductPerformance(transactions)
  
  return {
    basicStats,
    purchasePatterns,
    temporalAnalysis,
    productPerformance
  }
}

// 基礎統計計算
const calculateBasicStats = (transactions: TransactionData[]): BasicStats => {
  const totalItems = transactions.reduce((sum, t) => sum + t.items.length, 0)
  const uniqueProducts = new Set(transactions.flatMap(t => t.items))
  const avgBasketSize = totalItems / transactions.length
  
  // 籃子大小分布
  const basketSizeDistribution = new Map<number, number>()
  transactions.forEach(t => {
    const size = t.items.length
    basketSizeDistribution.set(size, (basketSizeDistribution.get(size) || 0) + 1)
  })

  // 商品頻率統計
  const productFrequency = new Map<string, number>()
  transactions.forEach(transaction => {
    transaction.items.forEach(item => {
      productFrequency.set(item, (productFrequency.get(item) || 0) + 1)
    })
  })

  return {
    totalTransactions: transactions.length,
    totalItems,
    uniqueProducts: uniqueProducts.size,
    avgBasketSize: Number(avgBasketSize.toFixed(2)),
    basketSizeDistribution: Array.from(basketSizeDistribution.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([size, count]) => ({
        basketSize: size,
        frequency: count,
        percentage: Number((count / transactions.length * 100).toFixed(1))
      })),
    topProducts: Array.from(productFrequency.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([product, frequency]) => ({
        product,
        frequency,
        percentage: Number((frequency / transactions.length * 100).toFixed(1))
      }))
  }
}

// 時間模式分析
const analyzeTemporalPatterns = (transactions: TransactionData[]): TemporalAnalysis => {
  const hourlyData = new Map<number, { count: number, totalValue: number }>()
  const dailyData = new Map<string, { count: number, totalValue: number }>()
  const weeklyData = new Map<number, { count: number, totalValue: number }>()
  
  transactions.forEach(transaction => {
    const date = new Date(transaction.timestamp)
    const hour = date.getHours()
    const dayOfWeek = date.getDay()
    const dayKey = date.toISOString().split('T')[0]
    
    // 按小時統計
    const hourStats = hourlyData.get(hour) || { count: 0, totalValue: 0 }
    hourStats.count += 1
    hourStats.totalValue += transaction.totalValue
    hourlyData.set(hour, hourStats)
    
    // 按星期統計
    const weekStats = weeklyData.get(dayOfWeek) || { count: 0, totalValue: 0 }
    weekStats.count += 1
    weekStats.totalValue += transaction.totalValue
    weeklyData.set(dayOfWeek, weekStats)
    
    // 按日期統計
    const dayStats = dailyData.get(dayKey) || { count: 0, totalValue: 0 }
    dayStats.count += 1
    dayStats.totalValue += transaction.totalValue
    dailyData.set(dayKey, dayStats)
  })

  return {
    hourlyPattern: Array.from(hourlyData.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([hour, stats]) => ({
        hour,
        transactions: stats.count,
        avgValue: Number((stats.totalValue / stats.count).toFixed(0)),
        totalValue: Math.round(stats.totalValue)
      })),
    weeklyPattern: Array.from(weeklyData.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([dayOfWeek, stats]) => ({
        dayOfWeek,
        dayName: ['週日', '週一', '週二', '週三', '週四', '週五', '週六'][dayOfWeek],
        transactions: stats.count,
        avgValue: Number((stats.totalValue / stats.count).toFixed(0))
      })),
    peakHours: identifyPeakHours(hourlyData),
    recommendations: generateTemporalRecommendations(hourlyData, weeklyData)
  }
}
```

### 視覺化實現

#### 1. 關聯網絡圖
```typescript
// 商品關聯網絡圖配置
const createAssociationNetworkGraph = (
  rules: AssociationRule[],
  maxNodes: number = 30
) => {
  const nodes = new Map<string, any>()
  const links: any[] = []

  // 選取最重要的規則
  const topRules = rules
    .sort((a, b) => b.lift * b.confidence - a.lift * a.confidence)
    .slice(0, maxNodes)

  topRules.forEach(rule => {
    const antecedentKey = rule.antecedent.join(', ')
    const consequentKey = rule.consequent.join(', ')

    // 添加節點
    if (!nodes.has(antecedentKey)) {
      nodes.set(antecedentKey, {
        id: antecedentKey,
        name: antecedentKey,
        symbolSize: Math.min(rule.support * 2000 + 15, 60),
        category: 'antecedent',
        itemStyle: { color: '#3B82F6' }
      })
    }
    
    if (!nodes.has(consequentKey)) {
      nodes.set(consequentKey, {
        id: consequentKey,
        name: consequentKey,
        symbolSize: Math.min(rule.support * 2000 + 15, 60),
        category: 'consequent',
        itemStyle: { color: '#10B981' }
      })
    }

    // 添加連接
    links.push({
      source: antecedentKey,
      target: consequentKey,
      value: rule.lift,
      lineStyle: {
        width: Math.min(rule.confidence * 8, 6),
        opacity: 0.7,
        color: rule.lift > 2 ? '#EF4444' : '#F59E0B'
      },
      label: {
        show: rule.lift > 2,
        formatter: `提升度: ${rule.lift.toFixed(1)}`
      }
    })
  })

  return {
    nodes: Array.from(nodes.values()),
    links,
    categories: [
      { name: 'antecedent', itemStyle: { color: '#3B82F6' } },
      { name: 'consequent', itemStyle: { color: '#10B981' } }
    ]
  }
}

// 網絡圖ECharts配置
const networkGraphOption = {
  tooltip: {
    formatter: (params: any) => {
      if (params.dataType === 'edge') {
        return `${params.data.source} → ${params.data.target}<br/>
                提升度: ${params.data.value.toFixed(2)}<br/>
                連線寬度代表信心度`
      } else {
        return `商品: ${params.data.name}<br/>
                節點大小代表支持度`
      }
    }
  },
  legend: {
    data: ['前項商品', '後項商品'],
    bottom: 10
  },
  series: [{
    name: '商品關聯網絡',
    type: 'graph',
    layout: 'force',
    animation: true,
    roam: true,
    focusNodeAdjacency: true,
    draggable: true,
    force: {
      repulsion: 1000,
      gravity: 0.1,
      edgeLength: [50, 200],
      layoutAnimation: true
    },
    itemStyle: {
      borderColor: '#fff',
      borderWidth: 2,
      shadowBlur: 10,
      shadowColor: 'rgba(0, 0, 0, 0.3)'
    },
    lineStyle: {
      curveness: 0.3
    },
    label: {
      show: true,
      position: 'right',
      formatter: '{b}',
      fontSize: 12
    },
    emphasis: {
      focus: 'adjacency',
      lineStyle: {
        width: 8
      }
    }
  }]
}
```

#### 2. 支持度-信心度散點圖
```typescript
// 規則品質評估散點圖
const createQualityScatterPlot = (rules: AssociationRule[]) => {
  const scatterData = rules.map(rule => ({
    value: [rule.support * 100, rule.confidence * 100, rule.lift],
    name: `${rule.antecedent.join(', ')} → ${rule.consequent.join(', ')}`,
    itemStyle: {
      color: rule.lift > 3 ? '#EF4444' : rule.lift > 2 ? '#F59E0B' : rule.lift > 1.5 ? '#10B981' : '#6B7280'
    }
  }))

  return {
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        return `${params.data.name}<br/>
                支持度: ${params.data.value[0].toFixed(2)}%<br/>
                信心度: ${params.data.value[1].toFixed(2)}%<br/>
                提升度: ${params.data.value[2].toFixed(2)}`
      }
    },
    xAxis: {
      type: 'value',
      name: '支持度 (%)',
      nameLocation: 'middle',
      nameGap: 30,
      min: 0
    },
    yAxis: {
      type: 'value',
      name: '信心度 (%)',
      nameLocation: 'middle',
      nameGap: 40,
      min: 0,
      max: 100
    },
    visualMap: {
      dimension: 2,
      min: 1,
      max: 5,
      precision: 1,
      text: ['高提升度', '低提升度'],
      textGap: 30,
      inRange: {
        color: ['#6B7280', '#10B981', '#F59E0B', '#EF4444']
      },
      calculable: true,
      right: 20,
      bottom: 50
    },
    series: [{
      type: 'scatter',
      data: scatterData,
      symbolSize: (data: number[]) => Math.min(data[2] * 10, 40),
      emphasis: {
        itemStyle: {
          shadowBlur: 20,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  }
}
```

### 性能優化策略

#### 1. 大規模數據處理
```typescript
// 分批處理大規模交易數據
class ScalableMarketBasketAnalyzer {
  private chunkSize: number = 1000
  private minSupport: number = 0.01
  
  constructor(chunkSize: number = 1000, minSupport: number = 0.01) {
    this.chunkSize = chunkSize
    this.minSupport = minSupport
  }

  // 增量式頻繁項目集更新
  async processLargeDataset(
    transactions: TransactionData[],
    onProgress?: (progress: number) => void
  ): Promise<AssociationRule[]> {
    const totalChunks = Math.ceil(transactions.length / this.chunkSize)
    const globalItemSupport = new Map<string, number>()
    const globalPairSupport = new Map<string, number>()
    
    for (let i = 0; i < totalChunks; i++) {
      const start = i * this.chunkSize
      const end = Math.min(start + this.chunkSize, transactions.length)
      const chunk = transactions.slice(start, end)
      
      // 處理當前批次
      const { itemSupport, pairSupport } = this.processChunk(chunk)
      
      // 合併結果到全域支持度
      this.mergeSupport(globalItemSupport, itemSupport)
      this.mergeSupport(globalPairSupport, pairSupport)
      
      if (onProgress) {
        onProgress((i + 1) / totalChunks)
      }
    }
    
    // 基於全域支持度生成規則
    return this.generateRulesFromSupport(
      globalItemSupport, 
      globalPairSupport, 
      transactions.length
    )
  }
  
  private processChunk(chunk: TransactionData[]) {
    return aprioriAlgorithm(chunk, this.minSupport)
  }
  
  private mergeSupport(
    global: Map<string, number>, 
    local: Map<string, number>
  ) {
    local.forEach((count, key) => {
      global.set(key, (global.get(key) || 0) + count)
    })
  }
}
```

#### 2. 實時推薦系統優化
```typescript
// 快取機制優化推薦性能
class CachedRecommendationEngine {
  private ruleCache: Map<string, AssociationRule[]>
  private recommendationCache: Map<string, ProductRecommendation[]>
  private cacheExpiry: number = 5 * 60 * 1000 // 5分鐘過期
  
  constructor(rules: AssociationRule[]) {
    this.ruleCache = new Map()
    this.recommendationCache = new Map()
    this.precomputeFrequentBaskets(rules)
  }
  
  // 預計算常見購物籃組合
  private precomputeFrequentBaskets(rules: AssociationRule[]) {
    const frequentBaskets = this.identifyFrequentBaskets(rules)
    
    frequentBaskets.forEach(basket => {
      const basketKey = basket.sort().join(',')
      const applicableRules = rules.filter(rule =>
        rule.antecedent.every(item => basket.includes(item))
      )
      this.ruleCache.set(basketKey, applicableRules)
    })
  }
  
  // 快速推薦生成
  generateFastRecommendations(basket: string[]): ProductRecommendation[] {
    const basketKey = basket.sort().join(',')
    const cacheKey = `rec_${basketKey}`
    
    // 檢查快取
    if (this.recommendationCache.has(cacheKey)) {
      const cached = this.recommendationCache.get(cacheKey)!
      return cached
    }
    
    // 查找預計算規則或動態計算
    const applicableRules = this.ruleCache.get(basketKey) || 
                           this.findApplicableRules(basket)
    
    const recommendations = this.computeRecommendations(basket, applicableRules)
    
    // 更新快取
    this.recommendationCache.set(cacheKey, recommendations)
    
    // 設置過期清理
    setTimeout(() => {
      this.recommendationCache.delete(cacheKey)
    }, this.cacheExpiry)
    
    return recommendations
  }
}
```

### 業務智能分析

#### 1. ROI 評估模型
```typescript
// 關聯規則商業價值評估
interface BusinessValueAssessment {
  rule: AssociationRule
  revenueImpact: RevenueImpact
  implementationCost: number
  roi: number
  paybackPeriod: number
  riskLevel: 'Low' | 'Medium' | 'High'
  recommendation: string
}

const assessBusinessValue = (
  rule: AssociationRule,
  transactionData: TransactionData[],
  avgOrderIncrease: number = 20,
  implementationCost: number = 3000
): BusinessValueAssessment => {
  const totalTransactions = transactionData.length
  const affectedTransactions = Math.floor(rule.support * totalTransactions)
  
  // 收入影響計算
  const baseRevenue = affectedTransactions * avgOrderIncrease
  const upliftRevenue = baseRevenue * rule.confidence * 0.6 // 60%實現率
  const annualUplift = upliftRevenue * 12 // 年化
  
  // ROI計算
  const netBenefit = annualUplift - implementationCost
  const roi = (netBenefit / implementationCost) * 100
  const paybackPeriod = implementationCost / (upliftRevenue || 1)
  
  // 風險評估
  const riskLevel = assessRiskLevel(rule, affectedTransactions)
  
  return {
    rule,
    revenueImpact: {
      baseRevenue,
      upliftRevenue: Math.round(upliftRevenue),
      annualUplift: Math.round(annualUplift),
      affectedTransactions
    },
    implementationCost,
    roi: Math.round(roi),
    paybackPeriod: Math.round(paybackPeriod * 10) / 10,
    riskLevel,
    recommendation: generateBusinessRecommendation(roi, paybackPeriod, riskLevel)
  }
}

// 風險等級評估
const assessRiskLevel = (
  rule: AssociationRule, 
  affectedTransactions: number
): 'Low' | 'Medium' | 'High' => {
  if (rule.lift > 2.5 && rule.confidence > 0.7 && affectedTransactions > 100) {
    return 'Low'
  } else if (rule.lift > 1.5 && rule.confidence > 0.5 && affectedTransactions > 50) {
    return 'Medium'
  } else {
    return 'High'
  }
}
```

#### 2. 競爭分析和基準比較
```typescript
// 行業基準比較分析
interface BenchmarkAnalysis {
  category: string
  ourPerformance: PerformanceMetrics
  industryBenchmark: PerformanceMetrics
  gap: number
  recommendation: string
}

const performBenchmarkAnalysis = (
  rules: AssociationRule[],
  industryData: IndustryBenchmark[]
): BenchmarkAnalysis[] => {
  const categories = ['食品', '日用品', '電子產品', '服飾']
  
  return categories.map(category => {
    const categoryRules = rules.filter(rule =>
      rule.antecedent.some(item => getProductCategory(item) === category)
    )
    
    const ourPerformance = calculateCategoryPerformance(categoryRules)
    const benchmark = industryData.find(b => b.category === category)
    
    const gap = ourPerformance.avgLift - (benchmark?.avgLift || 1.5)
    
    return {
      category,
      ourPerformance,
      industryBenchmark: benchmark || getDefaultBenchmark(),
      gap,
      recommendation: generateBenchmarkRecommendation(gap, category)
    }
  })
}
```

---

**最後更新**: 2025-08-10
**版本**: v1.4
**維護者**: 數據科學學習實驗室團隊

> 這份技術筆記將隨著項目發展持續更新，記錄所有重要的技術決策、解決方案和最佳實踐。MODULE 06 商品關聯分析器的完成標誌著數據挖掘技術在零售業的成功應用，實現了從交易數據到商業洞察的完整轉換，為智能推薦和交叉銷售奠定了堅實基礎。