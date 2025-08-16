export interface NavItem {
  id: string;
  title: string;
  path: string;
  folder?: string;
}

export interface NavSection {
  id: string;
  title: string;
  description: string;
  items: NavItem[];
}

export const navigationData: NavSection[] = [
  {
    id: 'main',
    title: 'Data Science Lab',
    description: '商業數據科學實戰學習實驗室總覽',
    items: [
      { id: 'master-plan', title: '總體計劃', path: '/docs/00-Master-Plan', folder: 'data-science-lab' },
      { id: 'learning-roadmap', title: '學習路線圖', path: '/docs/01-Learning-Roadmap', folder: 'data-science-lab' },
      { id: 'concepts', title: '數據科學概念', path: '/docs/02-Data-Science-Concepts', folder: 'data-science-lab' },
      { id: 'module-03', title: 'Module 03 概覽', path: '/docs/MODULE-03', folder: 'data-science-lab' },
      { id: 'module-04', title: 'Module 04 概覽', path: '/docs/MODULE-04', folder: 'data-science-lab' },
      { id: 'progress', title: '開發進度', path: '/docs/PROGRESS', folder: 'data-science-lab' },
      { id: 'progress-tracking', title: '進度追蹤', path: '/docs/progress-tracking', folder: 'data-science-lab' },
      { id: 'technical-notes', title: '技術筆記', path: '/docs/technical-notes', folder: 'data-science-lab' },
    ]
  },
  {
    id: 'modules',
    title: 'Modules',
    description: '詳細模組規格和實作指南',
    items: [
      { id: 'module-template', title: '模組模板', path: '/docs/modules/module-template', folder: 'modules' },
      { id: 'module-01', title: 'KPI 實驗室', path: '/docs/modules/module-01-kpi-lab', folder: 'modules' },
      { id: 'module-02', title: '趨勢分解器', path: '/docs/modules/module-02-trend-decomposer', folder: 'modules' },
      { id: 'module-03', title: '客戶行為分析', path: '/docs/modules/module-03-customer-behavior-lab', folder: 'modules' },
      { id: 'module-04', title: '產品分布分析', path: '/docs/modules/module-04-product-distribution-lab', folder: 'modules' },
      { id: 'module-05', title: '客戶分群實驗', path: '/docs/modules/module-05-customer-segmentation-lab', folder: 'modules' },
      { id: 'module-06', title: '市場籃分析', path: '/docs/modules/module-06-market-basket-analyzer', folder: 'modules' },
    ]
  },
  {
    id: 'tutorials',
    title: 'Tutorials',
    description: '深入教學材料和理論基礎',
    items: [
      { id: 'tutorial-readme', title: '教程說明', path: '/docs/tutorial/README', folder: 'tutorial' },
      { id: 'data-fundamentals', title: '數據基礎', path: '/docs/tutorial/01-data-fundamentals', folder: 'tutorial' },
      { id: 'time-series', title: '時間序列分析', path: '/docs/tutorial/02-time-series-analysis', folder: 'tutorial' },
      { id: 'customer-behavior', title: '客戶行為分析', path: '/docs/tutorial/03-customer-behavior-analytics', folder: 'tutorial' },
      { id: 'product-distribution', title: '產品分布分析', path: '/docs/tutorial/04-product-distribution-analytics', folder: 'tutorial' },
      { id: 'customer-segmentation', title: '客戶分群分析', path: '/docs/tutorial/05-customer-segmentation-analytics', folder: 'tutorial' },
      { id: 'market-basket', title: '市場籃分析', path: '/docs/tutorial/06-market-basket-analytics', folder: 'tutorial' },
    ]
  }
];

export function getNavItemById(id: string): NavItem | undefined {
  for (const section of navigationData) {
    const item = section.items.find(item => item.id === id);
    if (item) return item;
  }
  return undefined;
}

export function getNavSectionById(id: string): NavSection | undefined {
  return navigationData.find(section => section.id === id);
}