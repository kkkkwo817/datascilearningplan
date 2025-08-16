import { notFound } from 'next/navigation';
import { getDocContent, getAllDocSlugs } from '@/lib/markdown';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { Clock, BookOpen, Tag } from 'lucide-react';

interface DocPageProps {
  params: Promise<{
    slug?: string[];
  }>;
}

export async function generateStaticParams() {
  const slugs = getAllDocSlugs();
  return slugs.map((slug) => ({
    slug: slug,
  }));
}

export default async function DocPage({ params }: DocPageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug || [];

  const doc = await getDocContent(slug);

  if (!doc) {
    notFound();
  }

  // Extract metadata from content
  const readingTime = Math.ceil(doc.content.length / 1000);
  const wordCount = doc.content.split(/\s+/).length;

  return (
    <div className="max-w-4xl mx-auto p-8">
      {/* Document Header */}
      <div className="mb-8 pb-6 border-b border-slate-200">
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
          <BookOpen className="w-4 h-4" />
          <span>Data Science Lab</span>
          {slug.length > 1 && (
            <>
              <span>/</span>
              <span className="capitalize">{slug[0]}</span>
            </>
          )}
        </div>
        
        <h1 className="text-4xl font-bold text-slate-900 mb-4">
          {doc.title}
        </h1>
        
        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>約 {readingTime} 分鐘閱讀</span>
          </div>
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4" />
            <span>{wordCount.toLocaleString()} 字</span>
          </div>
          {slug[0] && (
            <div className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-medium capitalize">
              {slug[0] === 'modules' ? '模組規格' : slug[0] === 'tutorial' ? '教學材料' : '主要文檔'}
            </div>
          )}
        </div>
      </div>

      {/* Document Content */}
      <div className="prose prose-slate max-w-none">
        <MarkdownRenderer content={doc.content} />
      </div>

      {/* Table of Contents - could be added later */}
      {/* Footer Navigation - could be added later */}
    </div>
  );
}