'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, ChevronRight, BookOpen, FileText, GraduationCap } from 'lucide-react';
import { navigationData } from '@/lib/navigation';

const sectionIcons = {
  main: BookOpen,
  modules: FileText,
  tutorials: GraduationCap,
};

export default function Sidebar() {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['main']));
  const pathname = usePathname();

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const isActive = (path: string) => pathname === path;

  return (
    <div className="w-80 bg-slate-50 border-r border-slate-200 h-screen overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">DataSciLearning</h1>
            <p className="text-sm text-slate-600">商業數據科學學習平台</p>
          </div>
        </div>

        <nav className="space-y-2">
          {navigationData.map((section) => {
            const Icon = sectionIcons[section.id as keyof typeof sectionIcons];
            const isExpanded = expandedSections.has(section.id);

            return (
              <div key={section.id} className="space-y-1">
                {/* Section Header */}
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between p-3 text-left rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-slate-600" />
                    <div>
                      <div className="font-semibold text-slate-900">{section.title}</div>
                      <div className="text-xs text-slate-500 mt-1">{section.description}</div>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  )}
                </button>

                {/* Section Items */}
                {isExpanded && (
                  <div className="pl-8 space-y-1">
                    {section.items.map((item) => (
                      <Link
                        key={item.id}
                        href={item.path}
                        className={`block px-3 py-2 text-sm rounded-md transition-colors ${
                          isActive(item.path)
                            ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-500'
                            : 'text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {item.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </div>
  );
}