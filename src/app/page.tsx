import { BookOpen, Target, Users, TrendingUp } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">
          商業數據科學實戰學習實驗室
        </h1>
        <p className="text-xl text-slate-600 mb-8">
          通過 12 個實戰模組掌握數據科學核心技能，在真實商業場景中應用所學知識
        </p>
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
          <p className="text-slate-700 leading-relaxed">
            這是一個為期 8 週的系統性商業數據科學學習計劃，專注於企業實際業務場景：
            <strong className="text-slate-900">銷售、支出、門店、產品、地區</strong>等數據分析。
          </p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-white p-6 rounded-lg border border-slate-200 text-center">
          <BookOpen className="w-8 h-8 text-blue-500 mx-auto mb-3" />
          <div className="text-2xl font-bold text-slate-900">12</div>
          <div className="text-sm text-slate-600">學習模組</div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-slate-200 text-center">
          <Target className="w-8 h-8 text-green-500 mx-auto mb-3" />
          <div className="text-2xl font-bold text-slate-900">3</div>
          <div className="text-sm text-slate-600">學習階段</div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-slate-200 text-center">
          <TrendingUp className="w-8 h-8 text-purple-500 mx-auto mb-3" />
          <div className="text-2xl font-bold text-slate-900">20+</div>
          <div className="text-sm text-slate-600">技術算法</div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-slate-200 text-center">
          <Users className="w-8 h-8 text-orange-500 mx-auto mb-3" />
          <div className="text-2xl font-bold text-slate-900">8</div>
          <div className="text-sm text-slate-600">學習週數</div>
        </div>
      </div>

      {/* Learning Stages */}
      <div className="space-y-8">
        <h2 className="text-2xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
          <div className="w-1 h-6 bg-blue-500 rounded"></div>
          學習階段
        </h2>

        {/* Stage 1 */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">
              1
            </div>
            <h3 className="text-xl font-semibold text-green-800">
              第一階段：數據基礎操作 (已完成)
            </h3>
          </div>
          <p className="text-green-700 mb-4">
            建立數據處理和基礎分析的核心技能，掌握 SQL 聚合函數、窗口函數、時間序列分析等基礎概念。
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded border border-green-200">
              <h4 className="font-medium text-green-800 mb-2">Module 01-02</h4>
              <p className="text-sm text-green-600">營收KPI儀表板、銷售趨勢分析器</p>
            </div>
            <div className="bg-white p-4 rounded border border-green-200">
              <h4 className="font-medium text-green-800 mb-2">Module 03-04</h4>
              <p className="text-sm text-green-600">客戶行為分析、產品銷售分布器</p>
            </div>
          </div>
        </div>

        {/* Stage 2 */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center font-bold">
              2
            </div>
            <h3 className="text-xl font-semibold text-yellow-800">
              第二階段：高級分析技術 (進行中)
            </h3>
          </div>
          <p className="text-yellow-700 mb-4">
            掌握聚類、相關性分析等中級數據科學技術，學習機器學習基礎算法。
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded border border-yellow-200">
              <h4 className="font-medium text-yellow-800 mb-2">Module 05-06</h4>
              <p className="text-sm text-yellow-600">客戶分群實驗室、商品關聯分析器</p>
            </div>
            <div className="bg-white p-4 rounded border border-yellow-200">
              <h4 className="font-medium text-yellow-800 mb-2">Module 07-08</h4>
              <p className="text-sm text-yellow-600">銷售漏斗分析器、區域市場分析器</p>
            </div>
          </div>
        </div>

        {/* Stage 3 */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-slate-400 text-white rounded-full flex items-center justify-center font-bold">
              3
            </div>
            <h3 className="text-xl font-semibold text-slate-700">
              第三階段：進階數據科學 (規劃中)
            </h3>
          </div>
          <p className="text-slate-600 mb-4">
            探索高級分析技術和預測建模，學習機器學習和深度學習應用。
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded border border-slate-200">
              <h4 className="font-medium text-slate-700 mb-2">Module 09-10</h4>
              <p className="text-sm text-slate-500">同期群分析器、機器學習實驗室</p>
            </div>
            <div className="bg-white p-4 rounded border border-slate-200">
              <h4 className="font-medium text-slate-700 mb-2">Module 11-12</h4>
              <p className="text-sm text-slate-500">深度學習工作坊、AI營運優化平台</p>
            </div>
          </div>
        </div>
      </div>

      {/* Getting Started */}
      <div className="mt-12 text-center">
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">開始學習</h2>
        <p className="text-slate-600 mb-6">
          選擇左側導航欄中的任一模組開始你的數據科學學習之旅
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
            #數據科學
          </span>
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
            #商業分析
          </span>
          <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
            #機器學習
          </span>
          <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
            #實戰項目
          </span>
        </div>
      </div>
    </div>
  );
}
